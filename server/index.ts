import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Course, ClassSession, Appointment } from './models';

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = 'mongodb://127.0.0.1:27017/appointment-project';
const JWT_SECRET = 'super-secret-jwt-key-for-appointment-project';

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB via Mongo Compass!'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Auth Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied, token missing' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check existing
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      department: 'Computer Science', // default for now
      avatar: `https://i.pravatar.cc/150?u=${email}`,
    });
    
    await user.save();

    const token = jwt.sign({ _id: user._id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    
    // Convert to plain object and remove password
    const userObj = user.toObject();
    delete (userObj as any).password;

    res.json({ token, user: userObj });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error during sign up' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ _id: user._id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    
    const userObj = user.toObject();
    delete (userObj as any).password;

    res.json({ token, user: userObj });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error during login' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req: any, res: any) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error '});
  }
});

// Protected Public Routes (For this prototype, keeping it simple, but passing through)
// Ideal world would apply `authenticateToken` to all under /api/
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/classes', async (req, res) => {
  try {
    const classes = await ClassSession.find().populate('courseId').populate('facultyId', '-password');
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

app.post('/api/classes', authenticateToken, async (req, res) => {
  try {
    const { courseId, facultyId, roomId, dayOfWeek, startTime, endTime, type } = req.body;
    const newClass = new ClassSession({
      courseId, facultyId, roomId, dayOfWeek, startTime, endTime, type
    });
    await newClass.save();
    
    // Return populated class so frontend can use it directly
    const popClass = await ClassSession.findById(newClass._id).populate('courseId').populate('facultyId', '-password');
    res.json(popClass);
  } catch (error) {
    console.error('Failed to create class:', error);
    res.status(500).json({ error: 'Failed to create class' });
  }
});

app.delete('/api/classes/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await ClassSession.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete class' });
  }
});

app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

app.get('/api/appointments', authenticateToken, async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('studentId', '-password').populate('facultyId', '-password');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

app.post('/api/appointments', authenticateToken, async (req, res) => {
  try {
    const { studentId, facultyId, date, startTime, endTime, type, topic } = req.body;
    const appointment = new Appointment({
      studentId,
      facultyId,
      date,
      startTime,
      endTime,
      type,
      topic,
      status: 'pending'
    });
    await appointment.save();
    
    // Ensure we send back populated data to match state
    const popAppointment = await Appointment.findById(appointment._id).populate('studentId', '-password').populate('facultyId', '-password');
    res.json(popAppointment);
  } catch (error) {
    console.error('Failed to book appointment:', error);
    res.status(500).json({ error: 'Failed to book appointment' });
  }
});

app.patch('/api/appointments/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(id, { status }, { new: true })
        .populate('studentId', '-password').populate('facultyId', '-password');
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
