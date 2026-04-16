import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Course {
  _id: string;
  name: string;
  code: string;
  department: string;
  credits: number;
}

export interface ClassSession {
  _id: string;
  courseId: Course;
  facultyId: any;
  roomId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  type: 'lecture' | 'lab' | 'tutorial';
}

export interface Appointment {
  _id: string;
  studentId: any;
  facultyId: any;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'approved' | 'declined';
  type: 'virtual' | 'in-person';
  topic: string;
}

interface ScheduleContextType {
  courses: Course[];
  classes: ClassSession[];
  appointments: Appointment[];
  bookAppointment: (appointment: Partial<Appointment>) => Promise<void>;
  updateAppointmentStatus: (id: string, status: 'approved' | 'declined') => Promise<void>;
  addClass: (cls: Partial<ClassSession>) => Promise<void>;
  removeClass: (id: string) => Promise<void>;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const ScheduleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const { token } = useAuth();

  const fetchScheduleData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const [coursesRes, classesRes, appsRes] = await Promise.all([
        fetch('/api/courses', { headers }),
        fetch('/api/classes', { headers }),
        fetch('/api/appointments', { headers })
      ]);
      setCourses(await coursesRes.json());
      setClasses(await classesRes.json());
      setAppointments(await appsRes.json());
    } catch (error) {
      console.error('Failed to fetch schedule data:', error);
    }
  };

  useEffect(() => {
    fetchScheduleData();
  }, [token]);

  const bookAppointment = async (appointment: Partial<Appointment>) => {
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(appointment)
      });
      const newAppt = await res.json();
      setAppointments(prev => [...prev, newAppt]);
    } catch (error) {
      console.error('Error booking appointment', error);
    }
  };

  const updateAppointmentStatus = async (id: string, status: 'approved' | 'declined') => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setAppointments(prev => prev.map(app => app._id === id ? { ...app, status } : app));
      }
    } catch (error) {
      console.error('Error updating status', error);
    }
  };

  const addClass = async (cls: Partial<ClassSession>) => {
    try {
      const res = await fetch('/api/classes', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cls)
      });
      const newClass = await res.json();
      setClasses(prev => [...prev, newClass]);
    } catch (error) {
      console.error('Error adding class', error);
    }
  };

  const removeClass = async (id: string) => {
    try {
      const res = await fetch(`/api/classes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setClasses(prev => prev.filter(c => c._id !== id));
      }
    } catch (error) {
      console.error('Error removing class', error);
    }
  };

  return (
    <ScheduleContext.Provider value={{ courses, classes, appointments, bookAppointment, updateAppointmentStatus, addClass, removeClass }}>
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};
