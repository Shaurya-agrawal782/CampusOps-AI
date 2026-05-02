import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { grievanceAPI } from '../services/api';

const categoryIcons = {
  'Hostel':          { icon: 'bed',               class: 'infrastructure' },
  'Canteen':         { icon: 'restaurant',         class: 'sanitation' },
  'Library':         { icon: 'local_library',      class: 'water' },
  'Lab / IT':        { icon: 'computer',           class: 'electricity' },
  'Classroom':       { icon: 'school',             class: 'infrastructure' },
  'Transport':       { icon: 'directions_bus',     class: 'sanitation' },
  'Exam Cell':       { icon: 'edit_document',      class: 'water' },
  'Accounts / Fees': { icon: 'payments',           class: 'electricity' },
  'Maintenance':     { icon: 'build',              class: 'infrastructure' },
  'Security':        { icon: 'security',           class: 'safety' },
  'Sports':          { icon: 'sports_soccer',      class: 'sanitation' },
  'Administration':  { icon: 'account_balance',    class: 'water' },
  'Medical Room':    { icon: 'local_hospital',     class: 'safety' },
  'Scholarship Cell':{ icon: 'workspace_premium',  class: 'electricity' },
  'Other':           { icon: 'help_outline',       class: 'infrastructure' },
};

const statusLabels = {
  'submitted': 'Submitted',
  'in-review': 'In Review',
  'in-progress': 'In Progress',
  'resolved': 'Resolved',
  'escalated': 'Escalated',
  'reopened': 'Reopened',
  'closed': 'Closed',
};

export default function CitizenDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, grievancesRes] = await Promise.all([
        grievanceAPI.getStats(),
        grievanceAPI.getAll({ limit: 10 })
      ]);
      setStats(statsRes.data);
      setGrievances(grievancesRes.data.grievances);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} mins ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem 2rem', display: 'flex', justifyContent: 'center' }}>
        <div className="spinner" style={{ width: '3rem', height: '3rem' }}></div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem', maxWidth: '960px' }}>
      {/* Header */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} style={{ marginBottom:'2rem' }}>
        <h1 style={{ fontSize:'2rem', fontWeight:800, letterSpacing:'-0.02em', marginBottom:'0.25rem' }}>
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p style={{ fontSize:'1rem', color:'var(--on-surface-variant)' }}>
          Describe your problem naturally — CampusOps AI will structure and route it to the right campus unit.
        </p>
      </motion.div>

      {/* Quick Action Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'1rem', marginBottom:'2rem' }}>
        {[
          { to:'/triage',   icon:'report_problem', label:'Report Campus Issue',   sub:'AI triage in seconds',          color:'var(--primary)',   bg:'var(--ai-gradient)', isGrad:true },
          { to:'/copilot',  icon:'auto_awesome',   label:'Generate Application',  sub:'Formal draft in plain language', color:'#0EA5A4',         bg:'rgba(14,165,164,0.1)' },
          { to:'/track',    icon:'manage_search',  label:'Track My Ticket',       sub:'Real-time status updates',      color:'#6a1b9a',         bg:'rgba(106,27,154,0.08)' },
          { to:'/grievance/new', icon:'add_circle', label:'File Detailed Request', sub:'Full form with attachments',    color:'var(--secondary)', bg:'var(--secondary-container)' },
        ].map((a, i) => (
          <motion.div key={i} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.08 }}
            whileHover={{ y:-3, boxShadow:'var(--shadow-xl)' }}>
            <Link to={a.to} style={{ textDecoration:'none' }}>
              <div style={{
                padding:'1.5rem', borderRadius:'var(--radius-xl)', background: a.isGrad ? a.bg : 'var(--surface-container-lowest)',
                border: a.isGrad ? 'none' : '1px solid var(--outline-variant)',
                color: a.isGrad ? 'white' : 'var(--on-surface)', cursor:'pointer', height:'100%',
              }}>
                <div style={{ width:'2.75rem', height:'2.75rem', borderRadius:'var(--radius-md)',
                  background: a.isGrad ? 'rgba(255,255,255,0.2)' : a.bg, color: a.isGrad ? 'white' : a.color,
                  display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1rem' }}>
                  <span className="material-symbols-outlined" style={{ fontSize:'1.375rem' }}>{a.icon}</span>
                </div>
                <p style={{ fontWeight:700, fontSize:'0.9375rem', marginBottom:'0.25rem' }}>{a.label}</p>
                <p style={{ fontSize:'0.75rem', opacity: a.isGrad ? 0.8 : undefined, color: a.isGrad ? undefined : 'var(--on-surface-variant)' }}>{a.sub}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
        {[
          { label: 'Total Filed', value: stats?.total || 0, icon: 'description', variant: '' },
          { label: 'In Progress', value: stats?.inProgress || 0, icon: 'pending_actions', variant: 'stat-primary' },
          { label: 'Resolved', value: stats?.resolved || 0, icon: 'check_circle', variant: 'stat-success' },
          { label: 'Escalated', value: stats?.escalated || 0, icon: 'warning', variant: 'stat-warning' },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            transition={{ delay: i * 0.1 }} className={`stat-card ${stat.variant}`}>
            <div className="stat-icon">
              <span className="material-symbols-outlined" style={{ fontSize:'1.25rem' }}>{stat.icon}</span>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Recent Tickets */}
      <div style={{ marginBottom:'2rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
          <h2 style={{ fontSize:'1.25rem', fontWeight:700 }}>Your Recent Campus Requests</h2>
          <Link to="/track" style={{ fontSize:'0.875rem', fontWeight:600, color:'var(--primary)' }}>View All →</Link>
        </div>

        {grievances.length === 0 ? (
          <div className="card" style={{ textAlign:'center', padding:'3rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize:'3rem', color:'var(--outline)', marginBottom:'1rem', display:'block' }}>inbox</span>
            <h3 style={{ fontSize:'1.125rem', fontWeight:600, marginBottom:'0.5rem' }}>No campus requests yet</h3>
            <p style={{ color:'var(--on-surface-variant)', marginBottom:'1.5rem' }}>Describe your problem naturally — CampusOps AI will handle the rest.</p>
            <div style={{ display:'flex', gap:'0.75rem', justifyContent:'center', flexWrap:'wrap' }}>
              <Link to="/triage" className="btn btn-primary">Report Campus Issue</Link>
              <Link to="/copilot" className="btn btn-outline">Generate Application</Link>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {grievances.map((g, i) => {
              const catInfo = categoryIcons[g.category] || { icon: 'help', class: 'infrastructure' };
              return (
                <motion.div
                  key={g._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="grievance-item"
                >
                  <div className={`grievance-icon ${catInfo.class}`}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>{catInfo.icon}</span>
                  </div>
                  <div className="grievance-info">
                    <div className="grievance-title">{g.title}</div>
                    <div className="grievance-meta">
                      <span>ID: {g.trackingId}</span>
                      <span>•</span>
                      <span>{timeAgo(g.createdAt)}</span>
                    </div>
                  </div>
                  <div className="grievance-actions">
                    <span className={`badge badge-${g.status}`}>{statusLabels[g.status]}</span>
                    <span className={`badge badge-${g.priority}`}>{g.priority}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
