import { useState, useEffect } from 'react';
import { useSchedule } from '../context/ScheduleContext';
import { useAuth } from '../context/AuthContext';
import type { User } from '../context/AuthContext';
import { Trash2, PlusCircle, Book, User as UserIcon, Clock, MapPin } from 'lucide-react';
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
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` }
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

    // ✅ FIX: match backend (strings)
    await addClass({
      ...formData,
      courseId: formData.courseId as any,
      facultyId: formData.facultyId as any
    });

    setFormData({
      ...formData,
      roomId: '',
      startTime: '09:00',
      endTime: '10:30'
    });
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
                  <span>{cls.startTime}</span>
                  <span>{cls.endTime}</span>
                </div>

                <div className="schedule-details flex-1">
                  <h4>
                    {cls.courseId?.code} {cls.courseId?.name} - {cls.type}
                  </h4>
                  <p className="text-muted text-sm mt-1">
                    {dayMap[cls.dayOfWeek]} • Room {cls.roomId} • Prof. {cls.facultyId?.name}
                  </p>
                </div>

                <button
                  className="btn btn-outline"
                  onClick={() => removeClass(cls._id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            {classes.length === 0 && (
              <p className="text-muted text-center py-4">No scheduled classes.</p>
            )}
          </div>
        </div>

        <div className="card full-width">
          <div className="card-header">
            <h3>Add New Session</h3>
          </div>

          <form onSubmit={handleSubmit} className="flex-col gap-4 mt-4">

            <select
              value={formData.courseId}
              onChange={e => setFormData({ ...formData, courseId: e.target.value })}
            >
              <option value="">Select Course</option>
              {courses.map(c => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={formData.facultyId}
              onChange={e => setFormData({ ...formData, facultyId: e.target.value })}
            >
              <option value="">Select Faculty</option>
              {faculties.map(f => (
                <option key={f._id} value={f._id}>
                  {f.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Room"
              value={formData.roomId}
              onChange={e => setFormData({ ...formData, roomId: e.target.value })}
            />

            <button type="submit" className="btn btn-primary">
              <PlusCircle size={18} /> Add Session
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSchedule;
