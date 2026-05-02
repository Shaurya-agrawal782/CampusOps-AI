import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { aiAPI, grievanceAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { DEMO_TRIAGE_CACHE, DEMO_TICKETS } from '../data/demoData';
import { detectCluster } from '../utils/clusterUtils';

const DEMO_SAMPLES = [
  'Hostel B me 2 din se paani nahi aa raha',
  'Canteen food smells bad and students are feeling sick',
  'Library WiFi is not working before exams',
  'There is a fire smell near chemistry lab',
  'Fee payment done but portal still shows pending',
];

const PRIORITY_CONFIG = {
  low:      { color: '#2e7d32', bg: '#e8f5e9', label: 'Low',      icon: 'arrow_downward' },
  medium:   { color: '#1565c0', bg: '#e3f2fd', label: 'Medium',   icon: 'remove' },
  high:     { color: '#e65100', bg: '#fff3e0', label: 'High',     icon: 'arrow_upward' },
  critical: { color: '#b71c1c', bg: '#ffebee', label: 'Critical', icon: 'priority_high' },
};

const ISSUE_TYPE_CONFIG = {
  Issue:       { icon: 'report_problem', color: '#e65100' },
  Request:     { icon: 'assignment',     color: '#1565c0' },
  Emergency:   { icon: 'sos',            color: '#b71c1c' },
  Information: { icon: 'info',           color: '#2e7d32' },
};

const SENTIMENT_EMOJI = {
  Calm: '😌', Confused: '😕', Frustrated: '😤', Angry: '😡', Worried: '😟',
};

function genTicketId() {
  const now = new Date();
  const y = now.getFullYear();
  const n = String(Math.floor(Math.random() * 9000) + 1000);
  return `CAMP-${y}-${n}`;
}

export default function IssueTriage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [description, setDescription] = useState(searchParams.get('prefill') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [qrLocationDetected, setQrLocationDetected] = useState(!!searchParams.get('location'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [matchingCluster, setMatchingCluster] = useState(null);
  const textRef = useRef(null);

  const handleSample = (s) => {
    setDescription(s);
    setAiResult(null);
    setTicket(null);
    setMatchingCluster(null);
    setError('');
    textRef.current?.focus();
  };

  const handleSubmit = async () => {
    if (!description.trim()) { setError('Please describe your issue first.'); return; }
    setLoading(true);
    setError('');
    setAiResult(null);
    setTicket(null);

    try {
      // Check demo cache first for instant results on sample inputs
      const cached = DEMO_TRIAGE_CACHE[description.trim()];
      const classData = cached
        ? cached
        : (await aiAPI.classify({ title: location || 'Campus Issue', description })).data;
      setAiResult(classData);

      // Step 2 — Create real ticket
      const grievRes = await grievanceAPI.create({
        title: location ? `[${location}] ${description.substring(0, 60)}` : description.substring(0, 60),
        description, category: classData.category || 'Other', location,
      });
      const g = grievRes.data.grievance;
      setTicket({
        id: g.trackingId, dbId: g._id, status: 'Pending Review',
        createdAt: g.createdAt || new Date().toISOString(),
        campusUnit: g.aiClassification?.campusUnit || g.department || 'Student Support Desk',
        priority: g.priority, category: g.category,
      });
      
      const newT = {
        _id: g._id, trackingId: g.trackingId,
        title: location ? `[${location}] ${description.substring(0, 60)}` : description.substring(0, 60),
        description, category: classData.category || 'Other',
        location: { address: location }
      };
      setMatchingCluster(detectCluster(newT, DEMO_TICKETS));
      
    } catch (err) {
      // Graceful degradation — use cached result + demo ticket
      const cached = DEMO_TRIAGE_CACHE[description.trim()];
      const ai = aiResult || cached;
      if (cached && !aiResult) setAiResult(cached);
      if (ai) {
        const fakeId = genTicketId();
        setTicket({
          id: fakeId, status: 'Pending Review',
          createdAt: new Date().toISOString(),
          campusUnit: ai.campusUnit || 'Student Support Desk',
          priority: ai.priority || 'medium',
          category: ai.category || 'Other', demo: true,
        });
        
        const newT = {
          _id: fakeId, trackingId: fakeId,
          title: location ? `[${location}] ${description.substring(0, 60)}` : description.substring(0, 60),
          description, category: ai.category || 'Other',
          location: { address: location }
        };
        setMatchingCluster(detectCluster(newT, DEMO_TICKETS));
      } else {
        setError('Something went wrong. Your input is safe — please try again.');
      }
    } finally { setLoading(false); }

  };

  const pri = PRIORITY_CONFIG[aiResult?.priority] || PRIORITY_CONFIG.medium;
  const iType = ISSUE_TYPE_CONFIG[aiResult?.issueType] || ISSUE_TYPE_CONFIG.Issue;

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', background: 'var(--surface)', paddingBottom: '4rem' }}>
      <div className="container" style={{ maxWidth: '900px', paddingTop: '2.5rem' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'var(--secondary-container)', color: 'var(--secondary)',
            padding: '0.375rem 1rem', borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em',
            textTransform: 'uppercase', marginBottom: '1rem',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>smart_toy</span>
            AI-Powered Triage
            AI-Powered Triage
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Report a Campus Issue
          </h1>
          <p style={{ fontSize: '1.0625rem', color: 'var(--on-surface-variant)', maxWidth: '560px', margin: '0 auto' }}>
            Describe your issue in Hindi, English, or Hinglish — our AI will classify and route it instantly.
          </p>
        </motion.div>

        {/* Input Card */}
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }} style={{ marginBottom: '1.5rem', padding: '2rem' }}>

          {/* Demo samples */}
          <div style={{ marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.06em', color: 'var(--on-surface-variant)', marginBottom: '0.625rem' }}>
              Quick Examples
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {DEMO_SAMPLES.map((s, i) => (
                <button key={i} onClick={() => handleSample(s)} style={{
                  padding: '0.375rem 0.875rem', background: 'var(--surface-container)',
                  border: '1px solid var(--outline-variant)', borderRadius: 'var(--radius-full)',
                  fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 500,
                  cursor: 'pointer', transition: 'all 150ms',
                }}>
                  {s.length > 42 ? s.substring(0, 42) + '…' : s}
                </button>
              ))}
            </div>
          </div>

          {/* QR Detected Badge */}
          {qrLocationDetected && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                background: 'var(--secondary-container)', color: 'var(--secondary)',
                padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)',
                fontSize: '0.8125rem', fontWeight: 600, marginBottom: '1.25rem',
              }}>
              <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>qr_code_scanner</span>
              Location detected from QR: <strong>{location}</strong>
            </motion.div>
          )}

          {/* Description */}
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label" htmlFor="triage-desc">Describe Your Issue *</label>
            <textarea
              ref={textRef}
              id="triage-desc"
              className="form-textarea"
              rows={5}
              placeholder="Describe your campus issue or request in Hindi, English, or Hinglish..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{ fontSize: '1rem', lineHeight: 1.6, resize: 'vertical' }}
            />
          </div>

          {/* Location */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" htmlFor="triage-loc">Location / Building (Optional)</label>
            <input
              id="triage-loc"
              className="form-input"
              type="text"
              placeholder="Example: Hostel B, Library, Computer Lab 2"
              value={location}
              onChange={e => setLocation(e.target.value)}
            />
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.625rem',
                  padding: '0.875rem 1rem', background: 'var(--error-container)',
                  color: 'var(--error)', borderRadius: 'var(--radius-md)', marginBottom: '1rem',
                  fontSize: '0.875rem', fontWeight: 500,
                }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>error</span>
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <button onClick={handleSubmit} disabled={loading} className="btn btn-primary btn-lg"
            style={{ width: '100%', fontSize: '1rem', fontWeight: 700 }}>
            {loading
              ? <><div className="spinner" style={{ width: '1.125rem', height: '1.125rem', borderWidth: '2px' }} />
                  CampusOps AI is analyzing your request...</>
              : <><span className="material-symbols-outlined">smart_toy</span>Analyze &amp; Create Ticket</>
            }
          </button>
        </motion.div>

        {/* AI Result */}
        <AnimatePresence>
          {aiResult && !loading && (
            <motion.div key="ai-result" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              style={{ marginBottom: '1.5rem' }}>

              {/* AI Header banner */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.875rem 1.25rem',
                background: 'var(--ai-gradient)', borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
                color: 'white',
              }}>
                <span className="material-symbols-outlined filled" style={{ fontSize: '1.5rem' }}>smart_toy</span>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.9375rem' }}>AI Classification Complete</p>
                  <p style={{ fontSize: '0.75rem', opacity: 0.85 }}>
                    {aiResult.detectedLanguage && `Detected: ${aiResult.detectedLanguage} · `}
                    Confidence: {aiResult.confidence || '—'}%
                  </p>
                </div>
              </div>

              <div className="card" style={{
                borderRadius: '0 0 var(--radius-xl) var(--radius-xl)', padding: '1.75rem',
                borderTop: 'none', boxShadow: 'var(--shadow-xl)',
              }}>
                {/* Summary */}
                {aiResult.summary && (
                  <div style={{
                    padding: '1rem 1.25rem', background: 'var(--surface-container-low)',
                    borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--ai-teal)',
                    marginBottom: '1.5rem',
                  }}>
                    <p style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase',
                      letterSpacing: '0.06em', color: 'var(--on-surface-variant)', marginBottom: '0.35rem' }}>
                      AI Summary
                    </p>
                    <p style={{ fontSize: '0.9375rem', lineHeight: 1.6 }}>{aiResult.summary}</p>
                  </div>
                )}

                {/* Badges row */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem', marginBottom: '1.5rem' }}>
                  {/* Priority */}
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                    padding: '0.375rem 0.875rem', borderRadius: 'var(--radius-full)',
                    background: pri.bg, color: pri.color, fontWeight: 700, fontSize: '0.75rem',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>{pri.icon}</span>
                    {pri.label} Priority
                  </span>
                  {/* Issue type */}
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                    padding: '0.375rem 0.875rem', borderRadius: 'var(--radius-full)',
                    background: 'var(--surface-container)', color: iType.color,
                    fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase',
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>{iType.icon}</span>
                    {aiResult.issueType}
                  </span>
                  {/* Category */}
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                    padding: '0.375rem 0.875rem', borderRadius: 'var(--radius-full)',
                    background: 'rgba(0,35,111,0.07)', color: 'var(--primary)',
                    fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase',
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>category</span>
                    {aiResult.category}
                  </span>
                  {/* Sentiment */}
                  <span style={{
                    padding: '0.375rem 0.875rem', borderRadius: 'var(--radius-full)',
                    background: 'var(--surface-container)', fontWeight: 600, fontSize: '0.8125rem',
                  }}>
                    {SENTIMENT_EMOJI[aiResult.sentiment] || '😐'} {aiResult.sentiment}
                  </span>
                  {/* Admin Review */}
                  {aiResult.requiresAdminReview && (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                      padding: '0.375rem 0.875rem', borderRadius: 'var(--radius-full)',
                      background: '#fbe9e7', color: '#bf360c',
                      fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase',
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>admin_panel_settings</span>
                      Admin Review Required
                    </span>
                  )}
                </div>

                {/* Info grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ padding: '1rem', background: 'var(--surface-container-low)',
                    borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-container-high)' }}>
                    <p style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase',
                      color: 'var(--on-surface-variant)', marginBottom: '0.35rem' }}>Routed To</p>
                    <p style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{aiResult.campusUnit}</p>
                  </div>
                  <div style={{ padding: '1rem', background: 'var(--surface-container-low)',
                    borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-container-high)' }}>
                    <p style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase',
                      color: 'var(--on-surface-variant)', marginBottom: '0.35rem' }}>Category</p>
                    <p style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{aiResult.category}</p>
                  </div>
                </div>

                {/* Suggested Action */}
                {aiResult.suggestedAction && (
                  <div style={{
                    padding: '1rem 1.25rem', background: 'rgba(14,165,164,0.06)',
                    border: '1px solid rgba(14,165,164,0.2)', borderRadius: 'var(--radius-md)',
                    marginBottom: '1rem',
                  }}>
                    <p style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase',
                      color: 'var(--ai-teal)', marginBottom: '0.35rem' }}>Suggested Action</p>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>{aiResult.suggestedAction}</p>
                  </div>
                )}

                {/* Student Message */}
                {aiResult.studentMessage && (
                  <div style={{
                    padding: '1rem 1.25rem', background: 'var(--secondary-container)',
                    borderRadius: 'var(--radius-md)',
                  }}>
                    <p style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase',
                      color: 'var(--secondary)', marginBottom: '0.35rem' }}>Message for You</p>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.5, fontStyle: 'italic' }}>{aiResult.studentMessage}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ticket Confirmation */}
        <AnimatePresence>
          {ticket && !loading && (
            <motion.div key="ticket" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 280, damping: 22, delay: 0.15 }}
              style={{ marginBottom: '1.5rem' }}>

              <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                {/* Ticket header */}
                <div style={{
                  padding: '1.25rem 1.75rem',
                  background: 'linear-gradient(135deg, #00236f 0%, #0EA5A4 100%)',
                  color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="material-symbols-outlined filled" style={{ fontSize: '1.75rem' }}>confirmation_number</span>
                    <div>
                      <p style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: 600, textTransform: 'uppercase' }}>Ticket Created</p>
                      <p style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{ticket.id}</p>
                    </div>
                  </div>
                  <div style={{
                    background: 'rgba(255,255,255,0.2)', padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-full)', fontSize: '0.8125rem', fontWeight: 700,
                  }}>
                    {ticket.status}
                  </div>
                </div>

                {/* Ticket body */}
                <div style={{ padding: '1.5rem 1.75rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                    {[
                      { label: 'Routed To',  value: ticket.campusUnit },
                      { label: 'Category',   value: ticket.category },
                      { label: 'Priority',   value: ticket.priority?.toUpperCase(), color: PRIORITY_CONFIG[ticket.priority]?.color },
                      { label: 'Created At', value: new Date(ticket.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) },
                    ].map(({ label, value, color }) => (
                      <div key={label}>
                        <p style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase',
                          letterSpacing: '0.06em', color: 'var(--on-surface-variant)', marginBottom: '0.25rem' }}>{label}</p>
                        <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: color || 'var(--on-surface)' }}>{value}</p>
                      </div>
                    ))}
                  </div>

                  {ticket.demo && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--outline)', fontStyle: 'italic', marginBottom: '1rem' }}>
                      * Demo ticket — backend ticket creation unavailable. Connect to save permanently.
                    </p>
                  )}

                  {/* Status Timeline */}
                  <div style={{ marginTop: '0.5rem' }}>
                    <p style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase',
                      letterSpacing: '0.06em', color: 'var(--on-surface-variant)', marginBottom: '1rem' }}>Status Timeline</p>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0' }}>
                      {[
                        { label: 'Submitted',           icon: 'upload_file',    done: true  },
                        { label: 'AI Routed',           icon: 'smart_toy',      done: true  },
                        { label: 'Campus Unit Review',  icon: 'pending_actions',done: false },
                      ].map((step, i, arr) => (
                        <div key={step.label} style={{ display: 'flex', alignItems: 'center', flex: i < arr.length - 1 ? 1 : 'unset' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem' }}>
                            <motion.div
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 0.2 + i * 0.15 }}
                              style={{
                                width: '2.5rem', height: '2.5rem', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: step.done ? 'var(--ai-gradient)' : 'var(--surface-container-high)',
                                color: step.done ? 'white' : 'var(--outline)',
                                boxShadow: step.done ? '0 4px 12px rgba(14,165,164,0.35)' : 'none',
                              }}>
                              <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>{step.icon}</span>
                            </motion.div>
                            <p style={{
                              fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase',
                              letterSpacing: '0.04em', textAlign: 'center', maxWidth: '70px',
                              color: step.done ? 'var(--primary)' : 'var(--outline)',
                            }}>{step.label}</p>
                          </div>
                          {i < arr.length - 1 && (
                            <div style={{
                              flex: 1, height: '3px', marginBottom: '1.25rem', mx: '0.5rem',
                              background: 'var(--surface-container-high)', position: 'relative', overflow: 'hidden',
                            }}>
                              <motion.div
                                initial={{ width: '0%' }}
                                animate={{ width: '100%' }}
                                transition={{ delay: 0.4 + i * 0.2, duration: 0.6 }}
                                style={{ height: '100%', background: 'var(--ai-gradient)' }}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                    {ticket.dbId && (
                      <button onClick={() => navigate('/track')} className="btn btn-secondary btn-sm">
                        <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>track_changes</span>
                        Track Request
                      </button>
                    )}
                    <button onClick={() => { setDescription(''); setLocation(''); setAiResult(null); setTicket(null); }}
                      className="btn btn-outline btn-sm">
                      <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>add</span>
                      New Issue
                    </button>
                    <button onClick={() => navigate('/dashboard')} className="btn btn-ghost btn-sm">
                      Dashboard
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
