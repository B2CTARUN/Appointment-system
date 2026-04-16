import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { User } from '../context/AuthContext';
import { Users, Mail, Building, ShieldCheck } from 'lucide-react';
import './Dashboard.css'; // Reusing dashboard styles for card look

const AdminUsers: React.FC = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (err) {
        console.error('Failed to fetch users', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  return (
    <div className="dashboard">
      <div className="page-header">
        <h2>User Management</h2>
        <p className="text-muted">View all faculty and student accounts.</p>
      </div>

      <div className="card full-width">
        <div className="card-header">
          <h3>All Users</h3>
          <div className="badge badge-primary">{users.length} Total</div>
        </div>
        
        {loading ? (
          <p className="p-4 text-center text-muted">Loading users...</p>
        ) : (
          <div className="schedule-list mt-4">
            {users.map(u => (
              <div key={u._id} className="schedule-item align-center">
                <img src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}`} alt={u.name} className="avatar mr-4" style={{width: 40, height: 40}} />
                
                <div className="schedule-details flex-1">
                  <h4 className="flex align-center gap-2">
                    {u.name}
                    {u.role === 'admin' && <ShieldCheck size={16} className="text-primary-500" />}
                  </h4>
                  <p className="text-muted text-sm flex align-center gap-2 mt-1">
                    <Mail size={14} /> {u.email}
                    {u.department && <><span className="mx-2">•</span><Building size={14} /> {u.department}</>}
                  </p>
                </div>

                <div className={`badge ${u.role === 'faculty' ? 'badge-info' : u.role === 'admin' ? 'badge-warning' : 'badge-primary'}`}>
                  {u.role.toUpperCase()}
                </div>
              </div>
            ))}
            {users.length === 0 && <p className="text-muted text-center py-4">No users found.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
