import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Calendar, LayoutDashboard, Clock, Users, Settings, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const role = user?.role || 'student';

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} />, roles: ['student', 'faculty', 'admin'] },
    { name: 'Timetable', path: '/timetable', icon: <Calendar size={20} />, roles: ['student', 'faculty'] },
    { name: 'Appointments', path: '/appointments', icon: <Clock size={20} />, roles: ['student', 'faculty'] },
    { name: 'Schedule Admin', path: '/admin/schedule', icon: <Calendar size={20} />, roles: ['admin'] },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} />, roles: ['admin'] },
    { name: 'Rooms', path: '/admin/rooms', icon: <Settings size={20} />, roles: ['admin'] },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-placeholder"></div>
        <h2>EduSchedule</h2>
      </div>

      <nav className="sidebar-nav">
        {navItems.filter(item => item.roles.includes(role)).map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <img src={user?.avatar} alt={user?.name} className="avatar" />
          <div className="user-details">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">{user?.role}</span>
          </div>
        </div>
        <button className="btn btn-ghost logout-btn w-full justify-center" onClick={logout}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
