import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { User, Course, ClassSession, Appointment } from './models';

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ Environment variables
const MONGO_URI = process.env.MONGO_URI as string;
const JWT_SECRET = process.env.JWT_SECRET as string;

if (!MONGO_URI || !JWT_SECRET) {
  throw new Error("Missing environment variables");
}

app.use(cors());
app.use(express.json());

// ✅ MongoDB connection
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// ✅ Auth Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// ================= AUTH ROUTES =================

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      department: 'Computer Science',
      avatar: `https://i.pravatar.cc/150?u=${email}`,
    });

    await user.save();

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const userObj = user.toObject();
    delete (userObj as any).password;

    res.json({ token, user: userObj });

  } catch (err) {
    res.status(500).json({ error: 'Signup error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const userObj = user.toObject();
    delete (userObj as any).password;

    res.json({ token, user: userObj });

  } catch (err) {
    res.status(500).json({ error: 'Login error' });
  }
});

// ================= API ROUTES =================

app.get('/api/users', async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

app.get('/api/classes', async (req, res) => {
  const classes = await ClassSession.find()
    .populate('courseId')
    .populate('facultyId', '-password');
  res.json(classes);
});

app.post('/api/classes', authenticateToken, async (req, res) => {
  const newClass = new ClassSession(req.body);
  await newClass.save();

  const pop = await ClassSession.findById(newClass._id)
    .populate('courseId')
    .populate('facultyId', '-password');

  res.json(pop);
});

app.delete('/api/classes/:id', authenticateToken, async (req, res) => {
  await ClassSession.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.get('/api/courses', async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

app.get('/api/appointments', authenticateToken, async (req, res) => {
  const data = await Appointment.find()
    .populate('studentId', '-password')
    .populate('facultyId', '-password');
  res.json(data);
});

app.post('/api/appointments', authenticateToken, async (req, res) => {
  const appointment = new Appointment({
    ...req.body,
    status: 'pending'
  });

  await appointment.save();

  const pop = await Appointment.findById(appointment._id)
    .populate('studentId', '-password')
    .populate('facultyId', '-password');

  res.json(pop);
});

app.patch('/api/appointments/:id', authenticateToken, async (req, res) => {
  const updated = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  )
    .populate('studentId', '-password')
    .populate('facultyId', '-password');

  res.json(updated);
});

// ================= FRONTEND SERVING =================

const __dirnameResolved = path.resolve();

app.use(express.static(path.join(__dirnameResolved, '../dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirnameResolved, '../dist/index.html'));
});

// ================= START SERVER =================

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
