import React from 'react';
import { Calendar, Clock, ShieldCheck, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Landing.css';

const Landing: React.FC = () => {
  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav flex justify-between items-center px-8 py-4">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white z-10 relative">
          <div className="logo-placeholder" style={{width: 32, height: 32}}></div>
          EduSchedule
        </div>
        <div className="flex gap-4 z-10 relative">
          <Link to="/login" className="btn btn-ghost text-white border border-transparent hover:border-slate-600 transition-colors">Sign In</Link>
          <Link to="/login" className="btn btn-primary" style={{ backgroundColor: '#6366f1', color: '#fff' }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-wrapper">
        <div className="hero-content">
          <h1 className="hero-title">Revolutionize Campus Scheduling</h1>
          <p className="hero-subtitle">
            Experience the next generation of academic management. Seamlessly align your timetables, schedule office hours, and organize the chaos of campus life.
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <Link to="/login" className="btn btn-primary hero-btn flex items-center gap-2">
              Start Organizing <ArrowRight size={18} />
            </Link>
            <a href="#features" className="btn btn-outline hero-btn-outline">
              Explore Features
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="text-center mb-16 fade-in-section">
          <h2 className="section-title">Designed for Modern Academics</h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Everything you need to orchestrate the perfect semester, consolidated into one beautiful platform.
          </p>
        </div>

        <div className="features-grid">
          {/* Feature 1 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper f-primary">
              <Calendar size={28} />
            </div>
            <h3 className="feature-title">Smart Timetables</h3>
            <p className="feature-desc">
              Visual, conflict-free scheduling that lets you map out lectures, labs, and tutorials effortlessly across the week.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper f-success">
              <Clock size={28} />
            </div>
            <h3 className="feature-title">Seamless Appointments</h3>
            <p className="feature-desc">
              Book one-on-one sessions between students and faculty instantly. Approve and manage virtual meetings in real-time.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper f-warning">
              <ShieldCheck size={28} />
            </div>
            <h3 className="feature-title">Total Admin Control</h3>
            <p className="feature-desc">
              High-level overviews to manage university-wide courses, faculty assignments, and structural changes on the fly.
            </p>
          </div>
        </div>
      </section>

      {/* Analytics Preview Section */}
      <section className="preview-section">
        <div className="preview-container flex-col lg-row align-center gap-12">
          <div className="preview-text flex-1 fade-in-left">
            <h2 className="mb-4 text-3xl font-bold text-slate-800 dark:text-white">Crystal Clear Clarity</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 line-height-relaxed">
              No more messy spreadsheets. Experience your schedule through intuitive, premium dashboard layouts built for maximum productivity.
            </p>
            <ul className="preview-list">
              <li className="flex items-center gap-3"><BookOpen className="text-primary-500" /> Integrated course management</li>
              <li className="flex items-center gap-3"><Layers className="text-primary-500" /> Multi-role architecture</li>
            </ul>
          </div>
          <div className="preview-visual flex-1 fade-in-right">
             <div className="glass-mockup">
               {/* Decorative mockup elements */}
               <div className="mockup-header">
                 <div className="mockup-dots bg-danger-500"></div>
                 <div className="mockup-dots bg-warning-500"></div>
                 <div className="mockup-dots bg-success-500"></div>
               </div>
               <div className="mockup-body">
                 <div className="mockup-bar w-3/4 mb-4"></div>
                 <div className="mockup-bar w-1/2 mb-8"></div>
                 <div className="mockup-grid">
                   <div className="mockup-box rounded-lg"></div>
                   <div className="mockup-box rounded-lg"></div>
                   <div className="mockup-box rounded-lg"></div>
                   <div className="mockup-box rounded-lg"></div>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="text-center text-slate-500 text-sm py-8">
          © {new Date().getFullYear()} EduSchedule Appointment System. Created for academic excellence.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
