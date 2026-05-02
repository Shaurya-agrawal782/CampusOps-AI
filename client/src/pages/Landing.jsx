import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay },
});

const FEATURES = [
  {
    icon: 'smart_toy', color: '#1E3A8A', bg: 'rgba(30,58,138,0.08)',
    title: 'AI Issue Triage',
    desc: 'Classifies student issues in Hindi, English, or Hinglish and routes them to the right campus unit instantly.',
  },
  {
    icon: 'auto_awesome', color: '#0EA5A4', bg: 'rgba(14,165,164,0.08)',
    title: 'Application Co-pilot',
    desc: 'Turns a simple student request into a polished formal campus application draft in seconds.',
  },
  {
    icon: 'dashboard', color: '#6a1b9a', bg: 'rgba(106,27,154,0.08)',
    title: 'Admin Command Center',
    desc: 'Tracks priorities, campus unit workload, hotspots, and critical issues in one AI-assisted view.',
  },
];

const CAMPUS_CATEGORIES = [
  { icon: 'bed',            label: 'Hostel',         desc: 'Water, maintenance, and accommodation issues',  color: '#1E3A8A', bg: '#e8eaf6', unit: 'Hostel Warden' },
  { icon: 'restaurant',     label: 'Canteen',         desc: 'Food quality, hygiene, and service complaints', color: '#2e7d32', bg: '#e8f5e9', unit: 'Canteen Committee' },
  { icon: 'local_library',  label: 'Library',         desc: 'WiFi, books, seating, and noise concerns',      color: '#1565c0', bg: '#e3f2fd', unit: 'Library Office' },
  { icon: 'computer',       label: 'Lab / IT',        desc: 'Systems down, software, and network issues',    color: '#e65100', bg: '#fff3e0', unit: 'IT Support' },
  { icon: 'security',       label: 'Security',        desc: 'Safety hazards, lighting, and access issues',   color: '#b71c1c', bg: '#ffebee', unit: 'Security Office' },
  { icon: 'payments',       label: 'Accounts / Fees', desc: 'Fee payment, portal issues, and receipts',      color: '#6a1b9a', bg: '#f3e5f5', unit: 'Accounts Dept' },
];

const STEPS = [
  { icon: 'edit_note',      label: 'Student Input',     desc: 'Describe your issue in any language' },
  { icon: 'smart_toy',      label: 'Gemini Analysis',   desc: 'AI classifies, prioritizes, and structures' },
  { icon: 'alt_route',      label: 'Routed Ticket',     desc: 'Directed to the right campus unit' },
  { icon: 'task_alt',       label: 'Admin Action',      desc: 'Tracked, resolved, and confirmed' },
];

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const goTriage = () => navigate(user ? (user.role === 'admin' ? '/admin' : '/triage') : '/auth');
  const goApp    = () => navigate(user ? '/copilot' : '/auth');
  const goAdmin  = () => navigate(user?.role === 'admin' ? '/admin' : '/auth');

  return (
    <div className="page-wrapper">
      {/* ── Navbar ── */}
      <header className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="navbar-brand">
            <span className="material-symbols-outlined filled">school</span>
            <span>CampusOps AI</span>
          </Link>
          <nav className="navbar-links">
            <a href="#how-it-works" className="navbar-link">How It Works</a>
            <a href="#categories"   className="navbar-link">Categories</a>
            <a href="#features"     className="navbar-link">Features</a>
          </nav>
          <div className="navbar-actions">
            {user ? (
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn btn-secondary btn-sm">
                <span className="material-symbols-outlined" style={{ fontSize:'1rem' }}>dashboard</span>
                Dashboard
              </Link>
            ) : (
              <Link to="/auth" className="btn btn-secondary btn-sm">
                <span className="material-symbols-outlined" style={{ fontSize:'1rem' }}>login</span>
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <motion.section initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.6 }}
        style={{ position:'relative', padding:'6rem 2rem 8rem', overflow:'hidden', background:'var(--surface)' }}>

        {/* bg gradient blob */}
        <div style={{
          position:'absolute', top:'-20%', right:'-10%', width:'600px', height:'600px',
          borderRadius:'50%', background:'radial-gradient(circle, rgba(14,165,164,0.07) 0%, transparent 70%)',
          pointerEvents:'none',
        }} />

        <div style={{ maxWidth:'1280px', margin:'0 auto', display:'grid',
          gridTemplateColumns:'1.4fr 1fr', gap:'4rem', alignItems:'center', position:'relative', zIndex:1 }}>

          <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.1 }}>
            {/* Tag */}
            <div style={{
              display:'inline-flex', alignItems:'center', gap:'0.5rem',
              padding:'0.5rem 1rem', background:'var(--surface-container-lowest)',
              borderRadius:'var(--radius-full)', boxShadow:'var(--shadow-xl)', marginBottom:'2rem',
            }}>
              <span className="material-symbols-outlined filled" style={{ color:'var(--ai-teal)', fontSize:'1rem' }}>auto_awesome</span>
              <span style={{ fontSize:'0.6875rem', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--on-surface-variant)' }}>
                AI-Powered Smart Campus Solution
              </span>
            </div>

            <h1 style={{ fontSize:'clamp(2.5rem, 5vw, 3.75rem)', fontWeight:900, letterSpacing:'-0.03em',
              lineHeight:1.08, color:'var(--on-surface)', marginBottom:'1.25rem' }}>
              CampusOps <span style={{ background:'var(--ai-gradient)', WebkitBackgroundClip:'text',
                WebkitTextFillColor:'transparent' }}>AI</span>
            </h1>

            <p style={{ fontSize:'1.25rem', color:'var(--on-surface-variant)', lineHeight:1.7,
              maxWidth:'540px', marginBottom:'2.25rem' }}>
              AI-powered campus operations copilot for student issues, formal requests, intelligent routing, and admin insights.
            </p>

            <div style={{ display:'flex', flexWrap:'wrap', gap:'1rem', marginBottom:'2.5rem' }}>
              <motion.button whileHover={{ scale:1.03, y:-2 }} whileTap={{ scale:0.97 }}
                onClick={goTriage} className="btn btn-primary btn-lg">
                <span className="material-symbols-outlined" style={{ fontSize:'1.125rem' }}>report_problem</span>
                Report Campus Issue
              </motion.button>
              <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                onClick={goApp} className="btn btn-outline btn-lg">
                <span className="material-symbols-outlined" style={{ fontSize:'1.125rem' }}>auto_awesome</span>
                Generate Application
              </motion.button>
            </div>

            <div style={{ display:'flex', gap:'1.5rem', fontSize:'0.875rem', color:'var(--on-surface-variant)', flexWrap:'wrap' }}>
              {[
                { icon:'check_circle', label:'Hindi / Hinglish / English' },
                { icon:'bolt',         label:'AI Response in Seconds' },
                { icon:'lock',         label:'Secure & Confidential' },
              ].map(b => (
                <div key={b.label} style={{ display:'flex', alignItems:'center', gap:'0.375rem' }}>
                  <span className="material-symbols-outlined filled" style={{ color:'var(--secondary)', fontSize:'1rem' }}>{b.icon}</span>
                  {b.label}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Hero right card */}
          <motion.div initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.7, delay:0.3 }}
            style={{ position:'relative' }}>
            <div className="card" style={{ padding:'2rem', position:'relative', zIndex:2 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.5rem' }}>
                <div>
                  <h3 style={{ fontSize:'0.875rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em' }}>Live AI Insights</h3>
                  <p style={{ fontSize:'0.75rem', color:'var(--on-surface-variant)', marginTop:'0.2rem' }}>Campus Operations Today</p>
                </div>
                <span className="material-symbols-outlined animate-glow" style={{ color:'var(--primary)' }}>psychology</span>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:'0.875rem' }}>
                {[
                  { icon:'bolt',    label:'Avg. AI Classification', val:'1.2s',  color:'var(--primary)',   bg:'var(--primary-container)' },
                  { icon:'task_alt',label:'Issue Resolution Rate',   val:'94%',  color:'var(--secondary)', bg:'var(--secondary-container)' },
                  { icon:'route',   label:'Auto-Routed Tickets',     val:'100%', color:'var(--ai-teal)',   bg:'rgba(14,165,164,0.1)' },
                ].map(r => (
                  <div key={r.label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
                    padding:'0.875rem 1rem', background:'var(--surface-container-low)', borderRadius:'var(--radius-xl)' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.875rem' }}>
                      <div style={{ width:'2.25rem', height:'2.25rem', borderRadius:'50%',
                        background:r.bg, color:r.color, display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <span className="material-symbols-outlined" style={{ fontSize:'1rem' }}>{r.icon}</span>
                      </div>
                      <p style={{ fontSize:'0.8125rem', fontWeight:600 }}>{r.label}</p>
                    </div>
                    <span style={{ fontSize:'1.125rem', fontWeight:800, color:r.color }}>{r.val}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop:'1.25rem', paddingTop:'1rem', borderTop:'1px solid var(--surface-container-high)' }}>
                <button onClick={goAdmin} style={{
                  width:'100%', padding:'0.75rem', background:'var(--ai-gradient)', color:'white',
                  borderRadius:'var(--radius-md)', fontWeight:700, fontSize:'0.875rem',
                  border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize:'1rem' }}>dashboard</span>
                  Open Command Center
                </button>
              </div>
            </div>
            <div style={{ position:'absolute', bottom:'-0.75rem', right:'-0.75rem', width:'100%', height:'100%',
              background:'var(--surface-container-low)', borderRadius:'var(--radius-xl)', zIndex:0 }} />
          </motion.div>
        </div>
      </motion.section>

      {/* ── How It Works ── */}
      <section id="how-it-works" style={{ padding:'6rem 2rem', background:'var(--surface-container-low)' }}>
        <div style={{ maxWidth:'1280px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'4rem' }}>
            <p style={{ fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase',
              color:'var(--primary)', marginBottom:'0.75rem' }}>Process Overview</p>
            <h2 style={{ fontSize:'2.25rem', fontWeight:800, letterSpacing:'-0.025em', marginBottom:'1rem' }}>
              How CampusOps AI Works
            </h2>
            <p style={{ fontSize:'1.125rem', color:'var(--on-surface-variant)', lineHeight:1.6, maxWidth:'540px', margin:'0 auto' }}>
              Four simple steps from student complaint to admin resolution — all AI-assisted.
            </p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'2rem', position:'relative' }}>
            <div style={{ position:'absolute', top:'3rem', left:'12%', right:'12%', height:'2px',
              background:'rgba(197,197,211,0.25)', zIndex:0 }} />

            {STEPS.map((step, i) => (
              <motion.div key={i} {...fadeUp(i * 0.12)}
                style={{ display:'flex', flexDirection:'column', alignItems:'center',
                  textAlign:'center', position:'relative', zIndex:1 }}>
                <div style={{
                  width:'6rem', height:'6rem', borderRadius:'50%', marginBottom:'1.5rem',
                  background: i === 1
                    ? 'var(--ai-gradient)'
                    : 'var(--surface-container-lowest)',
                  boxShadow:'var(--shadow-xl)', display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  <span className="material-symbols-outlined filled" style={{
                    fontSize:'2rem', color: i === 1 ? 'white' : 'var(--primary)',
                  }}>{step.icon}</span>
                </div>
                <h4 style={{ fontSize:'1rem', fontWeight:700, marginBottom:'0.5rem' }}>{step.label}</h4>
                <p style={{ fontSize:'0.875rem', color:'var(--on-surface-variant)', lineHeight:1.5 }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3 Feature Cards ── */}
      <section id="features" style={{ padding:'6rem 2rem', background:'var(--surface)' }}>
        <div style={{ maxWidth:'1280px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'3.5rem' }}>
            <p style={{ fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase',
              color:'var(--primary)', marginBottom:'0.75rem' }}>Core Capabilities</p>
            <h2 style={{ fontSize:'2.25rem', fontWeight:800, letterSpacing:'-0.025em', marginBottom:'1rem' }}>
              Three Powerful AI Tools
            </h2>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'1.5rem' }}>
            {FEATURES.map((f, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)} className="card"
                style={{ padding:'2rem' }} whileHover={{ y:-4, boxShadow:'var(--shadow-xl)' }}>
                <div style={{ width:'3.5rem', height:'3.5rem', borderRadius:'var(--radius-lg)',
                  background:f.bg, color:f.color, display:'flex', alignItems:'center',
                  justifyContent:'center', marginBottom:'1.25rem' }}>
                  <span className="material-symbols-outlined" style={{ fontSize:'1.75rem' }}>{f.icon}</span>
                </div>
                <h4 style={{ fontSize:'1.125rem', fontWeight:800, marginBottom:'0.625rem' }}>{f.title}</h4>
                <p style={{ fontSize:'0.875rem', color:'var(--on-surface-variant)', lineHeight:1.65 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Campus Categories ── */}
      <section id="categories" style={{ padding:'6rem 2rem', background:'var(--surface-container-low)' }}>
        <div style={{ maxWidth:'1280px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'3.5rem' }}>
            <p style={{ fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase',
              color:'var(--primary)', marginBottom:'0.75rem' }}>15 Campus Categories</p>
            <h2 style={{ fontSize:'2.25rem', fontWeight:800, letterSpacing:'-0.025em', marginBottom:'1rem' }}>
              Issues We Handle
            </h2>
            <p style={{ fontSize:'1.125rem', color:'var(--on-surface-variant)', lineHeight:1.6, maxWidth:'500px', margin:'0 auto' }}>
              Our AI automatically routes your issue to the right campus unit.
            </p>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'0.875rem', maxWidth:'860px', margin:'0 auto' }}>
            {CAMPUS_CATEGORIES.map((cat, i) => (
              <motion.div key={i} {...fadeUp(i * 0.07)}
                whileHover={{ x:5, boxShadow:'0 8px 24px -8px rgba(25,28,30,0.1)' }}
                style={{ display:'flex', alignItems:'center', padding:'1.25rem 1.5rem',
                  background:'var(--surface-container-lowest)', borderRadius:'var(--radius-xl)',
                  border:'1px solid rgba(197,197,211,0.15)', gap:'1.25rem', transition:'all 0.2s' }}>
                <div style={{ width:'3rem', height:'3rem', borderRadius:'var(--radius-md)',
                  background:cat.bg, color:cat.color, display:'flex', alignItems:'center',
                  justifyContent:'center', flexShrink:0 }}>
                  <span className="material-symbols-outlined" style={{ fontSize:'1.5rem' }}>{cat.icon}</span>
                </div>
                <div style={{ flex:1 }}>
                  <h4 style={{ fontSize:'1rem', fontWeight:700, marginBottom:'0.2rem', color:cat.color }}>{cat.label}</h4>
                  <p style={{ fontSize:'0.875rem', color:'var(--on-surface-variant)' }}>{cat.desc}</p>
                </div>
                <div style={{ background:cat.bg, padding:'0.3rem 0.75rem', borderRadius:'var(--radius-full)',
                  fontSize:'0.75rem', fontWeight:600, color:cat.color, whiteSpace:'nowrap' }}>
                  → {cat.unit}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{ padding:'5rem 2rem', background:'var(--ai-gradient)', textAlign:'center', color:'white' }}>
        <motion.div initial={{ opacity:0, scale:0.95 }} whileInView={{ opacity:1, scale:1 }}
          viewport={{ once:true }} style={{ maxWidth:'640px', margin:'0 auto' }}>
          <h2 style={{ fontSize:'2.5rem', fontWeight:900, letterSpacing:'-0.025em', marginBottom:'1rem' }}>
            Ready to Report a Campus Issue?
          </h2>
          <p style={{ fontSize:'1.125rem', opacity:0.9, marginBottom:'2.25rem', lineHeight:1.6 }}>
            Describe your problem in plain language. CampusOps AI will structure, classify, and route it to the right team — instantly.
          </p>
          <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
            <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.97 }} onClick={goTriage}
              style={{ padding:'1rem 2.25rem', background:'white', color:'var(--primary)',
                borderRadius:'var(--radius-xl)', fontWeight:700, fontSize:'1rem',
                border:'none', cursor:'pointer', boxShadow:'0 12px 24px rgba(0,0,0,0.15)',
                display:'flex', alignItems:'center', gap:'0.5rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize:'1.125rem' }}>report_problem</span>
              Report Campus Issue
            </motion.button>
            <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.97 }} onClick={goApp}
              style={{ padding:'1rem 2.25rem', background:'rgba(255,255,255,0.15)',
                color:'white', borderRadius:'var(--radius-xl)', fontWeight:700, fontSize:'1rem',
                border:'1px solid rgba(255,255,255,0.3)', cursor:'pointer',
                display:'flex', alignItems:'center', gap:'0.5rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize:'1.125rem' }}>auto_awesome</span>
              Generate Application
            </motion.button>
            <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.97 }} onClick={() => navigate('/qr-zones')}
              style={{ padding:'1rem 2.25rem', background:'rgba(255,255,255,0.15)',
                color:'white', borderRadius:'var(--radius-xl)', fontWeight:700, fontSize:'1rem',
                border:'1px solid rgba(255,255,255,0.3)', cursor:'pointer',
                display:'flex', alignItems:'center', gap:'0.5rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize:'1.125rem' }}>qr_code_scanner</span>
              Try QR-based reporting
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding:'2rem', background:'var(--surface-container-low)',
        borderTop:'1px solid rgba(197,197,211,0.15)', textAlign:'center' }}>
        <div style={{ display:'flex', justifyContent:'center', gap:'2rem', marginBottom:'1rem', flexWrap:'wrap' }}>
          {[
            { icon:'visibility',  label:'Transparent Process' },
            { icon:'speed',       label:'AI-Powered Routing' },
            { icon:'translate',   label:'Multilingual Support' },
            { icon:'people',      label:'Student-First Design' },
          ].map((item, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:'0.5rem',
              fontSize:'0.875rem', color:'var(--on-surface-variant)' }}>
              <span className="material-symbols-outlined" style={{ fontSize:'1.125rem', color:'var(--primary)' }}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
        <p style={{ fontSize:'0.875rem', color:'var(--on-surface-variant)' }}>
          © 2026 CampusOps AI — Smart Campus Solution · BGI Hackathon
        </p>
      </footer>
    </div>
  );
}
