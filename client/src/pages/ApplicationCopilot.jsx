import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { DEMO_APP_CACHE } from '../data/demoData';

const REQUEST_TYPES = [
  { label: 'Leave Application',          icon: 'event_busy',        recipient: 'The Head of Department / Class Advisor' },
  { label: 'Bonafide Certificate Request', icon: 'workspace_premium', recipient: 'The Registrar / Student Welfare Office' },
  { label: 'Fee Extension Request',      icon: 'payments',          recipient: 'The Accounts Department' },
  { label: 'Hostel Leave Request',       icon: 'bed',               recipient: 'The Hostel Warden' },
  { label: 'Library Fine Issue',         icon: 'local_library',     recipient: 'The Chief Librarian' },
  { label: 'Scholarship Request',        icon: 'workspace_premium', recipient: 'The Scholarship / Student Welfare Office' },
  { label: 'Lab Permission Request',     icon: 'computer',          recipient: 'The Lab In-Charge / IT Support' },
  { label: 'Exam Form Correction',       icon: 'edit_document',     recipient: 'The Examination Cell' },
  { label: 'Medical Leave',             icon: 'local_hospital',    recipient: 'The Campus Medical Room / Class Advisor' },
  { label: 'Other Campus Request',       icon: 'help_outline',      recipient: 'The Administrative Office' },
];

const DEMO_SAMPLES = [
  { text: 'I need a bonafide certificate for scholarship submission.', type: 'Bonafide Certificate Request' },
  { text: 'I need leave for 3 days because of a family function.', type: 'Leave Application' },
  { text: 'I paid my fees but the portal still shows pending payment.', type: 'Fee Extension Request' },
  { text: 'I need permission to use the computer lab after college hours for project work.', type: 'Lab Permission Request' },
];

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function ApplicationCopilot() {
  const [form, setForm] = useState({
    requestType: '', studentName: '', rollNumber: '',
    department: '', recipient: '', details: '', dateFrom: '', dateTo: '',
  });
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);
  const [error, setError]       = useState('');
  const [copied, setCopied]     = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const selectType = (label) => {
    const rt = REQUEST_TYPES.find(r => r.label === label);
    set('requestType', label);
    if (rt) set('recipient', rt.recipient);
  };

  const fillDemo = ({ text, type }) => {
    setResult(null); setError('');
    setForm(f => ({ ...f, details: text, requestType: type,
      recipient: REQUEST_TYPES.find(r => r.label === type)?.recipient || f.recipient }));
  };

  const handleGenerate = async () => {
    if (!form.requestType) { setError('Please select a request type.'); return; }
    if (!form.details.trim()) { setError('Please describe your request.'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await api.post('/applications/generate', form);
      setResult(res.data);
    } catch (err) {
      // Try cached demo result first
      const cached = DEMO_APP_CACHE[form.details.trim()];
      if (cached) {
        setResult(cached);
      } else {
        setError(err.response?.data?.error || 'Something went wrong. Your input is safe — please try again.');
      }
    } finally { setLoading(false); }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.formalApplication);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    const content = [
      result.applicationTitle,
      `Subject: ${result.subject}`,
      '',
      result.formalApplication,
      '',
      result.missingDetails?.length ? `Missing Details:\n${result.missingDetails.map(d => `- ${d}`).join('\n')}` : '',
      '',
      result.suggestedAttachments?.length ? `Suggested Attachments:\n${result.suggestedAttachments.map(a => `- ${a}`).join('\n')}` : '',
      '',
      `Next Step: ${result.nextStep}`,
    ].join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.applicationTitle?.replace(/\s+/g, '_') || 'Application'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedTypeObj = REQUEST_TYPES.find(r => r.label === form.requestType);

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', background: 'var(--surface)', paddingBottom: '4rem' }}>
      <div className="container" style={{ maxWidth: '960px', paddingTop: '2.5rem' }}>

        {/* ── Page Header ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show"
          style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(0,35,111,0.08)', color: 'var(--primary)',
            padding: '0.375rem 1rem', borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em',
            textTransform: 'uppercase', marginBottom: '1rem',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>auto_awesome</span>
            AI Request Co-pilot
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: '0.5rem' }}>
            Application Generator
          </h1>
          <p style={{ fontSize: '1.0625rem', color: 'var(--on-surface-variant)', maxWidth: '540px', margin: '0 auto' }}>
            Describe your request in plain language — Gemini drafts a polished formal campus application instantly.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

          {/* ── LEFT: Input Panel ── */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.1 }}>

            {/* Demo samples */}
            <div className="card-flat" style={{ padding: '1.25rem', borderRadius: 'var(--radius-xl)', marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.06em', color: 'var(--on-surface-variant)', marginBottom: '0.75rem' }}>
                Quick Examples
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {DEMO_SAMPLES.map((s, i) => (
                  <button key={i} onClick={() => fillDemo(s)} style={{
                    textAlign: 'left', padding: '0.625rem 0.875rem',
                    background: 'var(--surface-container-lowest)', border: '1px solid var(--outline-variant)',
                    borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', color: 'var(--primary)',
                    fontWeight: 500, cursor: 'pointer', lineHeight: 1.4,
                    transition: 'all 150ms',
                  }}>
                    <span style={{ opacity: 0.5, marginRight: '0.5rem' }}>→</span>{s.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Form card */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Request Details</h2>

              {/* Request type */}
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Request Type *</label>
                <select className="form-select" value={form.requestType}
                  onChange={e => selectType(e.target.value)}>
                  <option value="">Select request type…</option>
                  {REQUEST_TYPES.map(r => (
                    <option key={r.label} value={r.label}>{r.label}</option>
                  ))}
                </select>
                {selectedTypeObj && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--outline)', marginTop: '0.25rem' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '0.875rem', verticalAlign: 'middle' }}>forward_to_inbox</span>
                    {' '}Routes to: {selectedTypeObj.recipient}
                  </p>
                )}
              </div>

              {/* Name + Roll */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Student Name</label>
                  <input className="form-input" placeholder="Shaurya Agrawal"
                    value={form.studentName} onChange={e => set('studentName', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Roll / Enrollment No.</label>
                  <input className="form-input" placeholder="12345"
                    value={form.rollNumber} onChange={e => set('rollNumber', e.target.value)} />
                </div>
              </div>

              {/* Department */}
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Department / Class</label>
                <input className="form-input" placeholder="B.Tech CSE — 3rd Year"
                  value={form.department} onChange={e => set('department', e.target.value)} />
              </div>

              {/* Recipient override */}
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Recipient (auto-filled, editable)</label>
                <input className="form-input" placeholder="The Registrar / Student Welfare Office"
                  value={form.recipient} onChange={e => set('recipient', e.target.value)} />
              </div>

              {/* Dates */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Date From (optional)</label>
                  <input className="form-input" type="date"
                    value={form.dateFrom} onChange={e => set('dateFrom', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Date To (optional)</label>
                  <input className="form-input" type="date"
                    value={form.dateTo} onChange={e => set('dateTo', e.target.value)} />
                </div>
              </div>

              {/* Details */}
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Describe Your Request *</label>
                <textarea className="form-textarea" rows={4}
                  placeholder="Example: I need a bonafide certificate for scholarship submission."
                  value={form.details} onChange={e => set('details', e.target.value)}
                  style={{ resize: 'vertical' }} />
                <p style={{ fontSize: '0.6875rem', color: 'var(--outline)', marginTop: '0.25rem' }}>
                  Hindi, English, or Hinglish — all supported.
                </p>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.75rem 1rem', background: 'var(--error-container)',
                      color: 'var(--error)', borderRadius: 'var(--radius-md)', marginBottom: '1rem',
                      fontSize: '0.875rem',
                    }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>error</span>
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <button onClick={handleGenerate} disabled={loading} className="btn btn-primary"
                style={{ width: '100%', fontWeight: 700, fontSize: '0.9375rem' }}>
                {loading
                  ? <><div className="spinner" style={{ width: '1rem', height: '1rem', borderWidth: '2px' }} />
                      CampusOps AI is drafting your formal request…</>
                  : <><span className="material-symbols-outlined">auto_awesome</span>Generate Formal Application</>
                }
              </button>
            </div>
          </motion.div>

          {/* ── RIGHT: Result Panel ── */}
          <div>
            <AnimatePresence mode="wait">
              {!result && !loading && (
                <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="card-flat" style={{
                    padding: '3rem 2rem', borderRadius: 'var(--radius-xl)',
                    textAlign: 'center', border: '2px dashed var(--outline-variant)',
                    background: 'transparent', minHeight: '400px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem',
                  }}>
                  <div style={{
                    width: '4rem', height: '4rem', borderRadius: '50%',
                    background: 'var(--surface-container)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: 'var(--outline)' }}>description</span>
                  </div>
                  <p style={{ fontWeight: 600, color: 'var(--on-surface-variant)', fontSize: '1rem' }}>
                    Your formal application will appear here
                  </p>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--outline)', maxWidth: '260px' }}>
                    Fill in the details on the left and click Generate.
                  </p>
                </motion.div>
              )}

              {loading && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="card" style={{
                    padding: '3rem 2rem', textAlign: 'center', minHeight: '400px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.25rem',
                  }}>
                  <div style={{
                    width: '4rem', height: '4rem', borderRadius: '50%',
                    background: 'var(--ai-gradient)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    boxShadow: 'var(--shadow-ai)',
                    animation: 'glowPulse 2s infinite',
                  }}>
                    <span className="material-symbols-outlined filled" style={{ fontSize: '2rem', color: 'white' }}>auto_awesome</span>
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '1.0625rem', marginBottom: '0.25rem' }}>
                      CampusOps AI is drafting your formal request…
                    </p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>
                      Analyzing context and generating application
                    </p>
                  </div>
                  <div className="skeleton" style={{ height: '1rem', width: '80%', borderRadius: 'var(--radius-full)' }} />
                  <div className="skeleton" style={{ height: '1rem', width: '65%', borderRadius: 'var(--radius-full)' }} />
                  <div className="skeleton" style={{ height: '1rem', width: '72%', borderRadius: 'var(--radius-full)' }} />
                </motion.div>
              )}

              {result && !loading && (
                <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 26 }}>

                  {/* Result header */}
                  <div style={{
                    padding: '1rem 1.5rem',
                    background: 'var(--ai-gradient)',
                    borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
                    color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <span className="material-symbols-outlined filled" style={{ fontSize: '1.375rem' }}>auto_awesome</span>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Application Generated</p>
                        <p style={{ fontSize: '0.6875rem', opacity: 0.8 }}>{result.tone}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={handleCopy} style={{
                        display: 'flex', alignItems: 'center', gap: '0.375rem',
                        padding: '0.375rem 0.875rem', borderRadius: 'var(--radius-full)',
                        background: copied ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.2)',
                        color: 'white', fontSize: '0.75rem', fontWeight: 700,
                        border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer',
                        transition: 'all 150ms',
                      }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>
                          {copied ? 'check' : 'content_copy'}
                        </span>
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                      <button onClick={handleDownload} style={{
                        display: 'flex', alignItems: 'center', gap: '0.375rem',
                        padding: '0.375rem 0.875rem', borderRadius: 'var(--radius-full)',
                        background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '0.75rem', fontWeight: 700,
                        border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer',
                        transition: 'all 150ms',
                      }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>download</span>
                        Download
                      </button>
                    </div>
                  </div>

                  <div className="card" style={{
                    borderRadius: '0 0 var(--radius-xl) var(--radius-xl)',
                    borderTop: 'none', padding: '1.5rem',
                  }}>
                    {/* Title + Subject */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, letterSpacing: '-0.01em', marginBottom: '0.25rem' }}>
                        {result.applicationTitle}
                      </h3>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)' }}>
                        <strong>Subject:</strong> {result.subject}
                      </p>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)' }}>
                        <strong>To:</strong> {result.recipient}
                      </p>
                    </div>

                    {/* Formal Application text */}
                    <div style={{
                      padding: '1.25rem', background: 'var(--surface-container-low)',
                      borderRadius: 'var(--radius-md)', border: '1px solid var(--surface-container-high)',
                      marginBottom: '1.25rem', maxHeight: '320px', overflowY: 'auto',
                    }}>
                      <pre style={{
                        fontFamily: 'var(--font-family)', fontSize: '0.875rem',
                        lineHeight: 1.75, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                        color: 'var(--on-surface)', margin: 0,
                      }}>
                        {result.formalApplication}
                      </pre>
                    </div>

                    {/* Missing Details */}
                    {result.missingDetails?.length > 0 && (
                      <div style={{
                        padding: '0.875rem 1rem', background: '#fff8e1',
                        border: '1px solid #ffe082', borderRadius: 'var(--radius-md)', marginBottom: '1rem',
                      }}>
                        <p style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase',
                          color: '#e65100', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>warning</span>
                          Missing Details — please add before submitting
                        </p>
                        <ul style={{ paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          {result.missingDetails.map((d, i) => (
                            <li key={i} style={{ fontSize: '0.8125rem', listStyleType: 'disc', color: '#6d4c00' }}>{d}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Suggested Attachments */}
                    {result.suggestedAttachments?.length > 0 && (
                      <div style={{ marginBottom: '1rem' }}>
                        <p style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase',
                          letterSpacing: '0.06em', color: 'var(--on-surface-variant)', marginBottom: '0.5rem' }}>
                          Suggested Attachments
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {result.suggestedAttachments.map((a, i) => (
                            <span key={i} style={{
                              display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                              padding: '0.25rem 0.75rem', background: 'var(--surface-container)',
                              border: '1px solid var(--outline-variant)', borderRadius: 'var(--radius-full)',
                              fontSize: '0.75rem', fontWeight: 600, color: 'var(--on-surface-variant)',
                            }}>
                              <span className="material-symbols-outlined" style={{ fontSize: '0.8125rem' }}>attach_file</span>
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Next Step */}
                    {result.nextStep && (
                      <div style={{
                        padding: '0.875rem 1rem',
                        background: 'rgba(14,165,164,0.06)', border: '1px solid rgba(14,165,164,0.2)',
                        borderRadius: 'var(--radius-md)',
                      }}>
                        <p style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase',
                          color: 'var(--ai-teal)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>arrow_forward</span>
                          Next Step
                        </p>
                        <p style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>{result.nextStep}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
