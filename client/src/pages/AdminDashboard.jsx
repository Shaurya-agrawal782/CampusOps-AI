import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { grievanceAPI } from '../services/api';
import api from '../services/api';
import AIAssistant from '../components/AIAssistant';
import ResolutionModal from '../components/ResolutionModal';
import { DEMO_TICKETS, DEMO_STATS, DEMO_AI_SUMMARY } from '../data/demoData';
import { computeClusters } from '../utils/clusterUtils';

const PRI = {
  low:      { color: '#2e7d32', bg: '#e8f5e9' },
  medium:   { color: '#1565c0', bg: '#e3f2fd' },
  high:     { color: '#e65100', bg: '#fff3e0' },
  critical: { color: '#b71c1c', bg: '#ffebee' },
};
const PIE_COLORS = ['#1E3A8A','#0EA5A4','#1b6d24','#e65100','#6a1b9a','#bf360c','#37474f','#c62828','#4e342e'];

const CAMPUS_UNITS = [
  'Hostel Warden / Hostel Maintenance','Canteen Committee / Food Services',
  'Library Office','IT Support / Lab Assistant','Academic Block Maintenance',
  'Transport Office','Examination Cell','Accounts Department',
  'Campus Maintenance Team','Campus Security Office',
];

const STATUS_LABELS = {
  submitted:'Submitted','in-review':'In Review','in-progress':'In Progress',
  resolved:'Resolved',escalated:'Escalated',reopened:'Reopened',closed:'Closed',
};

const catIcon = c => ({
  Hostel:'bed', Canteen:'restaurant', Library:'local_library', 'Lab / IT':'computer',
  Classroom:'school', Transport:'directions_bus', 'Exam Cell':'edit_document',
  'Accounts / Fees':'payments', Maintenance:'build', Security:'security',
  Sports:'sports_soccer', Administration:'account_balance', 'Medical Room':'local_hospital',
  'Scholarship Cell':'workspace_premium', Other:'help_outline'
}[c] || 'help_outline');

const timeAgo = d => {
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 60) return 'Just now';
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
};

// Hotspot demo data
const HOTSPOTS = [
  { area: 'Hostel Block',    icon: 'bed',            count: 0, severity: 'high' },
  { area: 'Canteen',         icon: 'restaurant',     count: 0, severity: 'medium' },
  { area: 'Computer Lab',    icon: 'computer',       count: 0, severity: 'medium' },
  { area: 'Library',         icon: 'local_library',  count: 0, severity: 'low' },
  { area: 'Academic Block',  icon: 'school',         count: 0, severity: 'low' },
  { area: 'Sports Ground',   icon: 'sports_soccer',  count: 0, severity: 'low' },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState({ status: '', priority: '' });
  const [loading, setLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [localStatus, setLocalStatus] = useState({});
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [resolutionTicket, setResolutionTicket] = useState(null);

  useEffect(() => { loadData(); }, [filter]);

  const loadData = async () => {
    try {
      const [sr, gr] = await Promise.all([
        grievanceAPI.getStats(),
        grievanceAPI.getAll({ ...filter, limit: 25 }),
      ]);
      setStats(sr.data);
      const liveTickets = gr.data.grievances;
      if (!liveTickets?.length) {
        // Auto-enable demo mode when DB is empty
        setTickets(DEMO_TICKETS);
        setStats(DEMO_STATS);
        setIsDemoMode(true);
      } else {
        setTickets(liveTickets);
        setIsDemoMode(false);
      }
    } catch (e) {
      console.error(e);
      setTickets(DEMO_TICKETS);
      setStats(DEMO_STATS);
      setIsDemoMode(true);
    }
    finally { setLoading(false); }
  };

  const loadAiSummary = async () => {
    setSummaryLoading(true);
    try {
      const res = await api.get('/admin/ai-summary');
      setAiSummary(res.data.summary);
    } catch {
      setAiSummary(DEMO_AI_SUMMARY);
      setIsDemoMode(true);
    } finally { setSummaryLoading(false); }
  };

  useEffect(() => { loadAiSummary(); }, []);

  const handleStatusUpdate = async (id, status) => {
    setUpdatingId(id);
    try {
      if (!id.startsWith('demo-')) {
        await grievanceAPI.updateStatus(id, { status, note: `Status updated to ${status} by admin` });
      }
      setLocalStatus(p => ({ ...p, [id]: status }));
      if (!id.startsWith('demo-')) await loadData();
    } catch {
      setLocalStatus(p => ({ ...p, [id]: status })); // demo / offline fallback
    } finally { setUpdatingId(null); }
  };

  // Derive campus unit workload from departmentStats
  const unitWorkload = (stats?.departmentStats || [])
    .filter(d => d._id)
    .map(d => ({ unit: d._id?.split('/')[0]?.trim() || d._id, count: d.total }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 9);

  // Priority distribution
  const priData = [
    { name: 'Low',      value: stats?.priorityStats?.find(p => p._id === 'low')?.count || 0,      fill: '#2e7d32' },
    { name: 'Medium',   value: stats?.priorityStats?.find(p => p._id === 'medium')?.count || 0,   fill: '#1565c0' },
    { name: 'High',     value: stats?.priorityStats?.find(p => p._id === 'high')?.count || 0,     fill: '#e65100' },
    { name: 'Critical', value: stats?.priorityStats?.find(p => p._id === 'critical')?.count || 0, fill: '#b71c1c' },
  ];

  // Urgent tickets
  const urgentTickets = tickets.filter(t =>
    ['high','critical'].includes(t.priority) && !['resolved','closed'].includes(t.status)
  );

  // Hotspot counts from live data
  const hotspots = HOTSPOTS.map(h => ({
    ...h,
    count: tickets.filter(t => t.category?.toLowerCase().includes(h.area.split(' ')[0].toLowerCase())).length
  }));

  // Compute AI Clusters
  const clusters = useMemo(() => computeClusters(tickets), [tickets]);

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh' }}>
      <div className="spinner" style={{ width:'3rem', height:'3rem' }} />
    </div>
  );

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Command Center</h2>
          <p>CampusOps Admin</p>
        </div>
        <nav className="sidebar-nav">
          {[
            { to:'/admin',            icon:'grid_view',    label:'Overview' },
            { to:'/admin/analytics',  icon:'analytics',    label:'Analytics' },
            { to:'/admin/map',        icon:'map',          label:'Live Map' },
          ].map(l => (
            <Link key={l.to} to={l.to} className={`sidebar-link ${location.pathname===l.to?'active':''}`}>
              <span className="material-symbols-outlined">{l.icon}</span>{l.label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button onClick={logout} className="sidebar-link" style={{ width:'100%', textAlign:'left' }}>
            <span className="material-symbols-outlined">logout</span>Logout
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>

          {/* ── Header ── */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.75rem', flexWrap:'wrap', gap:'1rem' }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.25rem' }}>
                <h1 style={{ fontSize:'2rem', fontWeight:800, letterSpacing:'-0.02em' }}>Campus Command Center</h1>
                {isDemoMode && (
                  <span style={{
                    padding:'0.25rem 0.75rem', background:'#fff3e0', color:'#e65100',
                    borderRadius:'var(--radius-full)', fontSize:'0.6875rem', fontWeight:700,
                    textTransform:'uppercase', letterSpacing:'0.06em', border:'1px solid #ffe082',
                    display:'flex', alignItems:'center', gap:'0.35rem',
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize:'0.875rem' }}>science</span>
                    Demo Mode
                  </span>
                )}
              </div>
              <p style={{ color:'var(--on-surface-variant)' }}>Real-time AI-powered campus operations dashboard · {user?.name}</p>
            </div>
            <div style={{ display:'flex', gap:'0.75rem' }}>
              <button onClick={() => { setIsDemoMode(!isDemoMode); if (isDemoMode) loadData(); else { setTickets(DEMO_TICKETS); setStats(DEMO_STATS); setAiSummary(DEMO_AI_SUMMARY); } }}
                className="btn btn-ghost btn-sm">
                <span className="material-symbols-outlined" style={{ fontSize:'1rem' }}>science</span>
                {isDemoMode ? 'Live Mode' : 'Demo Mode'}
              </button>
              <button onClick={loadData} className="btn btn-outline btn-sm">
                <span className="material-symbols-outlined" style={{ fontSize:'1rem' }}>refresh</span>Refresh
              </button>
            </div>
          </div>

          {/* ── 1. Summary Cards ── */}
          <div className="grid grid-4" style={{ marginBottom:'2rem' }}>
            {[
              { label:'Total Campus Issues', value: stats?.total||0,        icon:'inbox',           variant:'' },
              { label:'Pending Review',      value: stats?.pendingReview||0, icon:'pending_actions', variant:'stat-warning' },
              { label:'High Priority',       value: stats?.highPriority||0,  icon:'priority_high',   variant:'stat-error' },
              { label:'Resolved',            value: stats?.resolved||0,      icon:'check_circle',    variant:'stat-success' },
            ].map((s,i) => (
              <motion.div key={i} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                transition={{ delay: i*0.08 }} className={`stat-card ${s.variant}`}>
                <div className="stat-icon">
                  <span className="material-symbols-outlined" style={{ fontSize:'1.25rem' }}>{s.icon}</span>
                </div>
                <div className="stat-value">{s.value.toLocaleString()}</div>
                <div className="stat-label">{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* ── 2. AI Campus Situation Summary ── */}
          <div className="card" style={{ marginBottom:'2rem', padding:'0', overflow:'hidden' }}>
            <div style={{
              padding:'1rem 1.5rem', background:'var(--ai-gradient)', color:'white',
              display:'flex', justifyContent:'space-between', alignItems:'center',
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                <span className="material-symbols-outlined filled" style={{ fontSize:'1.5rem' }}>smart_toy</span>
                <div>
                  <p style={{ fontWeight:700 }}>AI Campus Situation Summary</p>
                  <p style={{ fontSize:'0.75rem', opacity:0.8 }}>Generated by CampusOps AI · Live</p>
                </div>
              </div>
              <button onClick={loadAiSummary} style={{
                background:'rgba(255,255,255,0.2)', border:'1px solid rgba(255,255,255,0.3)',
                borderRadius:'var(--radius-full)', padding:'0.375rem 0.875rem',
                color:'white', fontSize:'0.75rem', fontWeight:700, cursor:'pointer',
              }}>
                ↻ Refresh
              </button>
            </div>
            <div style={{ padding:'1.25rem 1.5rem', minHeight:'4rem', display:'flex', alignItems:'center' }}>
              {summaryLoading
                ? <div style={{ display:'flex', gap:'1rem', width:'100%' }}>
                    <div className="spinner" style={{ width:'1.25rem', height:'1.25rem', flexShrink:0 }} />
                    <p style={{ color:'var(--on-surface-variant)', fontStyle:'italic' }}>CampusOps AI is analyzing current situation…</p>
                  </div>
                : <p style={{ lineHeight:1.7, fontSize:'0.9375rem' }}>
                    {aiSummary || 'Click Refresh to generate an AI situation briefing.'}
                  </p>
              }
            </div>
          </div>

          {/* ── 3 & 4. Charts ── */}
          <div className="grid grid-2" style={{ marginBottom:'2rem' }}>
            {/* Campus Unit Workload */}
            <div className="card" style={{ padding:'1.5rem' }}>
              <h3 style={{ fontSize:'1rem', fontWeight:700, marginBottom:'1.25rem' }}>Campus Unit Workload</h3>
              <div style={{ height:'240px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={unitWorkload.length ? unitWorkload : [
                    {unit:'Hostel',count:0},{unit:'Canteen',count:0},{unit:'Library',count:0},
                    {unit:'Lab/IT',count:0},{unit:'Maintenance',count:0},
                  ]} layout="vertical" margin={{ left:8 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--surface-container-high)" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize:10 }} />
                    <YAxis dataKey="unit" type="category" axisLine={false} tickLine={false} tick={{ fontSize:10 }} width={90} />
                    <Tooltip />
                    <Bar dataKey="count" radius={[0,4,4,0]}>
                      {unitWorkload.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Priority Distribution */}
            <div className="card" style={{ padding:'1.5rem' }}>
              <h3 style={{ fontSize:'1rem', fontWeight:700, marginBottom:'1.25rem' }}>Priority Distribution</h3>
              <div style={{ height:'180px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={priData} cx="50%" cy="50%" innerRadius={50} outerRadius={75}
                      paddingAngle={4} dataKey="value" nameKey="name">
                      {priData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', marginTop:'0.75rem' }}>
                {priData.map(p => (
                  <div key={p.name} style={{ display:'flex', alignItems:'center', gap:'0.35rem' }}>
                    <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:p.fill }} />
                    <span style={{ fontSize:'0.75rem', fontWeight:600, color:'var(--on-surface-variant)' }}>{p.name} ({p.value})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly Trend */}
          <div className="card" style={{ padding:'1.5rem', marginBottom:'2rem' }}>
            <h3 style={{ fontSize:'1rem', fontWeight:700, marginBottom:'1.25rem' }}>Issue Trend (Last 6 Months)</h3>
            <div style={{ height:'180px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.monthlyTrends || []}>
                  <defs>
                    <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="var(--primary)" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--surface-container-high)" />
                  <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fontSize:10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize:10 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" stroke="var(--primary)" fill="url(#grad1)" strokeWidth={2.5} name="Filed" />
                  <Area type="monotone" dataKey="resolved" stroke="var(--secondary)" fill="transparent" strokeWidth={2} strokeDasharray="5 5" name="Resolved" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── 6. Urgent Attention Panel ── */}
          {urgentTickets.length > 0 && (
            <div className="card" style={{ padding:'1.5rem', marginBottom:'2rem', borderLeft:'4px solid var(--error)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.625rem', marginBottom:'1rem' }}>
                <span className="material-symbols-outlined" style={{ color:'var(--error)', fontSize:'1.375rem' }}>priority_high</span>
                <h3 style={{ fontSize:'1rem', fontWeight:700, color:'var(--error)' }}>
                  Urgent Attention Required — {urgentTickets.length} issue{urgentTickets.length>1?'s':''}
                </h3>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.625rem' }}>
                {urgentTickets.slice(0,5).map(t => {
                  const p = PRI[t.priority] || PRI.high;
                  return (
                    <div key={t._id} style={{
                      display:'flex', alignItems:'center', justifyContent:'space-between',
                      padding:'0.75rem 1rem', background:'var(--surface-container-low)',
                      borderRadius:'var(--radius-md)', gap:'1rem', flexWrap:'wrap',
                    }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', flex:1, minWidth:0 }}>
                        <span style={{
                          padding:'0.25rem 0.625rem', borderRadius:'var(--radius-full)',
                          background: p.bg, color: p.color, fontSize:'0.6875rem', fontWeight:700, textTransform:'uppercase', flexShrink:0,
                        }}>{t.priority}</span>
                        <div style={{ minWidth:0 }}>
                          <p style={{ fontWeight:600, fontSize:'0.875rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.title}</p>
                          <p style={{ fontSize:'0.75rem', color:'var(--on-surface-variant)' }}>
                            {t.trackingId} · {t.aiClassification?.campusUnit || t.department || 'Unassigned'}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => setResolutionTicket(t)} className="btn btn-outline btn-sm" style={{ flexShrink: 0, padding: '0.25rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <span className="material-symbols-outlined filled" style={{ fontSize: '1rem', color: 'var(--ai-teal)' }}>auto_awesome</span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Suggest Resolution</span>
                        </button>
                        <button onClick={() => navigate(`/admin/grievance/${t._id}`)}
                          className="btn btn-danger btn-sm" style={{ flexShrink:0 }}>
                          Review Now
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── AI Detected Issue Clusters ── */}
          {clusters.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="material-symbols-outlined filled" style={{ color: 'var(--ai-teal)' }}>hub</span>
                AI Detected Issue Clusters
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
                {clusters.map(cluster => {
                  const p = PRI[cluster.priority] || PRI.high;
                  return (
                    <motion.div key={cluster.id} className="card" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                      style={{ padding: '1.5rem', borderTop: `4px solid ${p.color}`, position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: 0, right: 0, padding: '0.5rem 1rem', background: 'var(--ai-gradient)', color: 'white', fontSize: '0.6875rem', fontWeight: 700, borderBottomLeftRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span className="material-symbols-outlined filled" style={{ fontSize: '0.875rem' }}>auto_awesome</span>
                        AI Clustered
                      </div>
                      
                      <h4 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '0.25rem', paddingRight: '6rem' }}>{cluster.title}</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginBottom: '1.25rem' }}>
                        CampusOps AI groups repeated reports so admins can solve root issues faster.
                      </p>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.8125rem', marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--on-surface-variant)' }}>Category:</span>
                          <span style={{ fontWeight: 600 }}>{cluster.category}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--on-surface-variant)' }}>Location:</span>
                          <span style={{ fontWeight: 600 }}>{cluster.location}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--on-surface-variant)' }}>Related Reports:</span>
                          <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{cluster.duplicateCount} students</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--on-surface-variant)' }}>Priority:</span>
                          <span style={{ padding: '0.125rem 0.5rem', background: p.bg, color: p.color, borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: '0.6875rem', textTransform: 'uppercase' }}>{cluster.priority}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--on-surface-variant)' }}>Campus Unit:</span>
                          <span style={{ fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{cluster.campusUnit}</span>
                        </div>
                      </div>

                      <div style={{ background: 'var(--surface-container-low)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
                        <p style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--primary)', marginBottom: '0.25rem' }}>Suggested Action</p>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)', lineHeight: 1.5 }}>{cluster.suggestedAction}</p>
                      </div>

                      <div>
                        <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--on-surface-variant)', marginBottom: '0.5rem' }}>Related Tickets:</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {cluster.relatedTickets.map(t => (
                            <span key={t._id} onClick={() => navigate(`/admin/grievance/${t._id}`)} 
                              style={{ padding: '0.25rem 0.5rem', background: 'var(--surface)', border: '1px solid var(--surface-container-high)', borderRadius: 'var(--radius-sm)', fontSize: '0.6875rem', fontWeight: 600, cursor: 'pointer', transition: 'all 150ms' }}>
                              {t.trackingId}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── 7. Campus Hotspot Areas ── */}
          <div className="card" style={{ padding:'1.5rem', marginBottom:'2rem' }}>
            <h3 style={{ fontSize:'1rem', fontWeight:700, marginBottom:'1.25rem' }}>Campus Hotspot Areas</h3>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(150px, 1fr))', gap:'0.75rem' }}>
              {hotspots.map((h, i) => {
                const p = PRI[h.severity] || PRI.low;
                return (
                  <div key={i} style={{
                    padding:'1rem', borderRadius:'var(--radius-md)',
                    background:'var(--surface-container-low)',
                    border:`1px solid ${h.count > 0 ? p.bg : 'var(--surface-container-high)'}`,
                    textAlign:'center',
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize:'1.5rem', color: h.count>0 ? p.color : 'var(--outline)', marginBottom:'0.5rem', display:'block' }}>{h.icon}</span>
                    <p style={{ fontSize:'0.8125rem', fontWeight:700, marginBottom:'0.25rem' }}>{h.area}</p>
                    <span style={{
                      padding:'0.125rem 0.5rem', borderRadius:'var(--radius-full)',
                      background: h.count>0 ? p.bg : 'var(--surface-container)', color: h.count>0 ? p.color : 'var(--outline)',
                      fontSize:'0.6875rem', fontWeight:700,
                    }}>{h.count} issue{h.count!==1?'s':''}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── 5. Recent Routed Tickets Table ── */}
          <div className="card" style={{ padding:'1.5rem', marginBottom:'2rem' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem', flexWrap:'wrap', gap:'0.75rem' }}>
              <h3 style={{ fontSize:'1rem', fontWeight:700 }}>Recent Routed Tickets</h3>
              <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
                {['','submitted','in-review','in-progress','high','critical'].map(f => (
                  <button key={f} onClick={() => {
                    if (f==='high'||f==='critical') setFilter(p=>({...p,priority:f,status:''}));
                    else setFilter(p=>({...p,status:f,priority:''}));
                  }} style={{
                    padding:'0.375rem 0.75rem', borderRadius:'var(--radius-full)',
                    fontSize:'0.75rem', fontWeight:600, cursor:'pointer', border:'none',
                    background: (filter.status===f||filter.priority===f) ? 'var(--primary)' : 'var(--surface-container)',
                    color: (filter.status===f||filter.priority===f) ? 'white' : 'var(--on-surface-variant)',
                  }}>{f||'All'}</button>
                ))}
              </div>
            </div>

            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.8125rem' }}>
                <thead>
                  <tr style={{ borderBottom:'1px solid var(--surface-container-high)' }}>
                    {['Ticket ID','Category','Campus Unit','Priority','Status','Created','Action'].map(h => (
                      <th key={h} style={{ padding:'0.625rem 0.75rem', textAlign:'left', fontSize:'0.6875rem',
                        fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em',
                        color:'var(--on-surface-variant)', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tickets.length === 0 && (
                    <tr><td colSpan={7} style={{ padding:'2rem', textAlign:'center', color:'var(--outline)' }}>No tickets found</td></tr>
                  )}
                  {tickets.map((t, i) => {
                    const currentStatus = localStatus[t._id] || t.status;
                    const p = PRI[t.priority] || PRI.medium;
                    return (
                      <motion.tr key={t._id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.03 }}
                        style={{ borderBottom:'1px solid var(--surface-container)', cursor:'pointer' }}
                        onClick={() => navigate(`/admin/grievance/${t._id}`)}>
                        <td style={{ padding:'0.75rem', fontWeight:700, color:'var(--primary)', whiteSpace:'nowrap' }}>{t.trackingId}</td>
                        <td style={{ padding:'0.75rem' }}>
                          <span style={{ display:'flex', alignItems:'center', gap:'0.375rem' }}>
                            <span className="material-symbols-outlined" style={{ fontSize:'1rem', color:'var(--outline)' }}>{catIcon(t.category)}</span>
                            {t.category || '—'}
                          </span>
                        </td>
                        <td style={{ padding:'0.75rem', maxWidth:'160px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {t.aiClassification?.campusUnit || t.department || '—'}
                        </td>
                        <td style={{ padding:'0.75rem' }}>
                          <span style={{ padding:'0.2rem 0.5rem', borderRadius:'var(--radius-full)', background:p.bg, color:p.color, fontWeight:700, fontSize:'0.6875rem', textTransform:'uppercase' }}>
                            {t.priority}
                          </span>
                        </td>
                        <td style={{ padding:'0.75rem' }}>
                          <span className={`badge badge-${currentStatus}`}>{STATUS_LABELS[currentStatus]}</span>
                        </td>
                        <td style={{ padding:'0.75rem', color:'var(--on-surface-variant)', whiteSpace:'nowrap' }}>{timeAgo(t.createdAt)}</td>
                        <td style={{ padding:'0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }} onClick={e => e.stopPropagation()}>
                          <button onClick={() => setResolutionTicket(t)} className="btn-icon" style={{ padding: '0.25rem', color: 'var(--ai-teal)', background: 'rgba(14,165,164,0.1)', borderRadius: 'var(--radius-sm)', flexShrink: 0, width: '1.75rem', height: '1.75rem' }} title="Suggest AI Resolution">
                            <span className="material-symbols-outlined filled" style={{ fontSize: '1.125rem' }}>auto_awesome</span>
                          </button>
                          <select value={currentStatus}
                            onChange={e => handleStatusUpdate(t._id, e.target.value)}
                            disabled={updatingId === t._id}
                            style={{
                              padding:'0.25rem 0.5rem', fontSize:'0.75rem', borderRadius:'var(--radius-sm)',
                              border:'1px solid var(--outline-variant)', background:'var(--surface-container-lowest)',
                              color:'var(--on-surface)', cursor:'pointer', height: '1.75rem'
                            }}>
                            {Object.entries(STATUS_LABELS).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                          </select>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </motion.div>
      </main>
      <ResolutionModal isOpen={!!resolutionTicket} onClose={() => setResolutionTicket(null)} ticket={resolutionTicket} />
    </div>
  );
}
