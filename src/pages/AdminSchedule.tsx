import React, { useState, useEffect } from 'react';
import { useSchedule } from '../context/ScheduleContext';
import { useAuth } from '../context/AuthContext';
import type { User } from '../context/AuthContext';
import { Calendar, Trash2, PlusCircle, Book, User as UserIcon, Clock, MapPin } from 'lucide-react';
import './Dashboard.css';

const AdminSchedule: React.FC = () => {
  const { classes, courses, addClass, removeClass } = useSchedule();
  const { token } = useAuth();
  const [faculties, setFaculties] = useState<User[]>([]);

  const [formData, setFormData] = useState({
    courseId: '',
    facultyId: '',
    roomId: '',
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '10:30',
    type: 'lecture'
  });

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const res = await fetch('/api/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const allUsers: User[] = await res.json();
          setFaculties(allUsers.filter(u => u.role === 'faculty'));
        }
      } catch (err) {
        console.error('Failed to fetch faculties', err);
      }
    };
    fetchFaculties();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.courseId || !formData.facultyId || !formData.roomId) return;
    await addClass(formData);
    // Reset room/time, keep same if desired, but let's reset partially
    setFormData({ ...formData, roomId: '', startTime: '09:00', endTime: '10:30' });
  };

  const dayMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="dashboard">
      <div className="page-header">
        <h2>Schedule Management</h2>
        <p className="text-muted">Create and manage timetable sessions.</p>
      </div>

      <div className="dashboard-grid">
        <div className="card full-width lg-col-span-2">
          <div className="card-header">
            <h3>Current Schedule</h3>
          </div>
          <div className="schedule-list mt-4">
            {classes.map(cls => (
              <div key={cls._id} className="schedule-item align-center">
                <div className="time-block">
                  <span className="start-time">{cls.startTime}</span>
                  <span className="end-time">{cls.endTime}</span>
                </div>
                
                <div className="schedule-details flex-1">
                  <h4>{cls.courseId?.code} {cls.courseId?.name} - {cls.type.charAt(0).toUpperCase() + cls.type.slice(1)}</h4>
                  <p className="text-muted text-sm mt-1">
                    {dayMap[cls.dayOfWeek]} • Room {cls.roomId} • Prof. {cls.facultyId?.name}
                  </p>
                </div>

                <button 
                  className="btn btn-outline" 
                  style={{ borderColor: 'var(--danger-500)', color: 'var(--danger-500)', padding: '0.5rem' }}
                  onClick={() => removeClass(cls._id)}
                  title="Delete Session"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {classes.length === 0 && <p className="text-muted text-center py-4">No scheduled classes.</p>}
          </div>
        </div>

        <div className="card full-width">
          <div className="card-header">
            <h3>Add New Session</h3>
          </div>
          <form onSubmit={handleSubmit} className="flex-col gap-4 mt-4">
            <div className="input-group">
              <label className="input-label flex align-center gap-2"><Book size={14} /> Course</label>
              <select className="input-field" value={formData.courseId} onChange={e => setFormData({...formData, courseId: e.target.value})} required>
                <option value="">Select Course...</option>
                {courses.map(c => <option key={c._id} value={c._id}>{c.code} - {c.name}</option>)}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label flex align-center gap-2"><UserIcon size={14} /> Faculty</label>
              <select className="input-field" value={formData.facultyId} onChange={e => setFormData({...formData, facultyId: e.target.value})} required>
                <option value="">Select Faculty...</option>
                {faculties.map(f => <option key={f._id} value={f._id}>{f.name} ({f.department})</option>)}
              </select>
            </div>

            <div className="flex gap-4">
              <div className="input-group flex-1">
                <label className="input-label">Type</label>
                <select className="input-field" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
                  <option value="lecture">Lecture</option>
                  <option value="lab">Lab</option>
                  <option value="tutorial">Tutorial</option>
                </select>
              </div>
              <div className="input-group flex-1">
                <label className="input-label">Day</label>
                <select className="input-field" value={formData.dayOfWeek} onChange={e => setFormData({...formData, dayOfWeek: parseInt(e.target.value)})}>
                  {dayMap.map((d, i) => <option key={i} value={i}>{d}</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="input-group flex-1">
                <label className="input-label flex align-center gap-2"><Clock size={14} /> Start Time</label>
                <input type="time" className="input-field" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} required />
              </div>
              <div className="input-group flex-1">
                <label className="input-label flex align-center gap-2"><Clock size={14} /> End Time</label>
                <input type="time" className="input-field" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} required />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label flex align-center gap-2"><MapPin size={14} /> Room ID</label>
              <input type="text" className="input-field" value={formData.roomId} onChange={e => setFormData({...formData, roomId: e.target.value})} placeholder="e.g. 101, Lab C" required />
            </div>

            <button type="submit" className="btn btn-primary w-full justify-center mt-2">
              <PlusCircle size={18} /> Add Session
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSchedule;
