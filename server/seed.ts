import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, Course, ClassSession, Appointment } from './models';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/appointment-project';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB. Seeding database...');

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await ClassSession.deleteMany({});
    await Appointment.deleteMany({});

    const passwordHash = await bcrypt.hash('password123', 10);

    // Create Users (with Tarun and Rajit as requested)
    const student = await User.create({
      name: 'Tarun',
      email: 'tarun@college.edu',
      password: passwordHash,
      role: 'student',
      department: 'Computer Science',
      avatar: 'https://i.pravatar.cc/150?u=student1',
    });

    const faculty = await User.create({
      name: 'Rajit',
      email: 'rajit@college.edu',
      password: passwordHash,
      role: 'faculty',
      department: 'Computer Science',
      avatar: 'https://i.pravatar.cc/150?u=faculty1',
    });

    await User.create({
      name: 'Admin User',
      email: 'admin@college.edu',
      password: passwordHash,
      role: 'admin',
      avatar: 'https://i.pravatar.cc/150?u=admin1',
    });

    // Create Courses
    const c1 = await Course.create({
      name: 'Introduction to Algorithms', code: 'CS301', department: 'Computer Science', credits: 4
    });
    
    const c2 = await Course.create({
      name: 'Database Management Systems', code: 'CS302', department: 'Computer Science', credits: 3
    });

    // Create Classes
    await ClassSession.create({
      courseId: c1._id, facultyId: faculty._id, roomId: 'r1', dayOfWeek: 1, startTime: '09:00', endTime: '10:30', type: 'lecture'
    });
    await ClassSession.create({
      courseId: c1._id, facultyId: faculty._id, roomId: 'r1', dayOfWeek: 3, startTime: '09:00', endTime: '10:30', type: 'lecture'
    });
    await ClassSession.create({
      courseId: c2._id, facultyId: faculty._id, roomId: 'r2', dayOfWeek: 2, startTime: '11:00', endTime: '12:30', type: 'lecture'
    });

    // Create Appointments
    await Appointment.create({
      studentId: student._id, facultyId: faculty._id, date: new Date().toISOString().split('T')[0], startTime: '14:00', endTime: '14:30', status: 'approved', type: 'in-person', topic: 'Project Discussion'
    });

    console.log('Seeding complete! Default password for seeded accounts is: password123');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
