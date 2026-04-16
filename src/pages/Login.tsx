import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../context/AuthContext';
import { LogIn, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student' as Role
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setErrorMsg(data.error || 'Authentication failed');
        return;
      }
      
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setErrorMsg('Network error. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-placeholder-large"></div>
          <h2>EduSchedule</h2>
          <p className="text-muted">{isLogin ? 'Sign in to your account' : 'Create a new account'}</p>
        </div>

        {errorMsg && <div className="badge badge-danger w-full mb-4 justify-center" style={{ padding: '0.75rem' }}>{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="flex-col gap-4 mb-6">
          {!isLogin && (
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input type="text" className="input-field" placeholder="Tarun" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required={!isLogin} />
            </div>
          )}
          
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input type="email" className="input-field" placeholder={isLogin ? "tarun@college.edu or rajit@college.edu" : "name@college.edu"} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          </div>
          
          <div className="input-group">
            <label className="input-label">Password</label>
            <input type="password" className="input-field" placeholder="password123" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
          </div>

          {!isLogin && (
            <div className="input-group">
              <label className="input-label">Role</label>
              <select className="input-field" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as Role})}>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
              </select>
            </div>
          )}

          <button type="submit" className="btn btn-primary w-full mt-4 justify-center" style={{ height: '3rem' }}>
            {isLogin ? <><LogIn size={18} /> Sign In</> : <><UserPlus size={18} /> Sign Up</>}
          </button>
        </form>

        <div className="login-footer">
          <p className="text-sm text-muted">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button type="button" className="btn-ghost" style={{ padding: 0, fontWeight: 600, color: 'var(--primary-600)' }} onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); }}>
              {isLogin ? "Sign Up" : "Log In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
