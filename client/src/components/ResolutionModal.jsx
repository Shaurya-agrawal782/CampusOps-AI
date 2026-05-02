import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateResolutionPlan } from '../utils/resolutionUtils';

export default function ResolutionModal({ isOpen, onClose, ticket }) {
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && ticket) {
      setLoading(true);
      setCopied(false);
      // Simulate AI generation delay for premium demo feel
      const timer = setTimeout(() => {
        setPlan(generateResolutionPlan(ticket));
        setLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, ticket]);

  const handleCopy = () => {
    if (!plan) return;
    const text = `Resolution Plan: ${plan.resolutionTitle}\n\nRequired Unit: ${plan.requiredCampusUnit}\nEstimated Time: ${plan.estimatedResolutionTime}\n\nSteps:\n${plan.recommendedSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nCommunication:\n${plan.communicationMessage}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(25, 28, 30, 0.6)', backdropFilter: 'blur(4px)'
    }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
            style={{
              background: 'var(--surface-container-lowest)', width: '100%', maxWidth: '640px', margin: '1rem',
              borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)', overflow: 'hidden', position: 'relative'
            }}>
            
            {/* Header */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--surface-container-high)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span className="material-symbols-outlined filled" style={{ color: 'var(--ai-teal)', fontSize: '1.375rem' }}>auto_awesome</span>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>AI Resolution Suggestion</h2>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)', marginLeft: '1.875rem' }}>For Ticket: <strong style={{color: 'var(--on-surface)'}}>{ticket?.trackingId}</strong></p>
              </div>
              <button onClick={onClose} className="btn-icon btn-ghost">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '2rem', minHeight: '340px' }}>
              {loading ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyItems: 'center', paddingTop: '3rem', gap: '1.25rem' }}>
                  <div className="spinner" style={{ width: '3rem', height: '3rem', borderTopColor: 'var(--ai-teal)' }} />
                  <p style={{ fontSize: '0.9375rem', color: 'var(--on-surface-variant)', fontWeight: 600 }}>CampusOps AI is generating an action plan...</p>
                </motion.div>
              ) : plan && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--on-surface)' }}>{plan.resolutionTitle}</h3>
                  
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
                    <div style={{ background: 'var(--surface-container-low)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)' }}>
                      <p style={{ fontSize: '0.6875rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--outline)', marginBottom: '0.125rem' }}>Required Unit</p>
                      <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{plan.requiredCampusUnit}</p>
                    </div>
                    <div style={{ background: 'var(--surface-container-low)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)' }}>
                      <p style={{ fontSize: '0.6875rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--outline)', marginBottom: '0.125rem' }}>Estimated Time</p>
                      <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{plan.estimatedResolutionTime}</p>
                    </div>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--on-surface-variant)' }}>Recommended Steps</p>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {plan.recommendedSteps.map((step, i) => (
                        <li key={i} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9375rem', color: 'var(--on-surface-variant)', alignItems: 'flex-start' }}>
                          <span style={{ fontWeight: 700, color: 'var(--ai-teal)', background: 'rgba(14,165,164,0.1)', width: '1.5rem', height: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', flexShrink: 0, fontSize: '0.75rem' }}>{i + 1}</span>
                          <span style={{ paddingTop: '0.125rem' }}>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ background: 'var(--surface-container)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', borderLeft: '4px solid var(--primary)' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--primary)', marginBottom: '0.5rem' }}>Draft Communication to Student</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', fontStyle: 'italic', lineHeight: 1.6 }}>"{plan.communicationMessage}"</p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--surface-container-high)', display: 'flex', justifyContent: 'flex-end', gap: '1rem', background: 'var(--surface-container-lowest)' }}>
              <button onClick={onClose} className="btn btn-ghost">Close</button>
              <button onClick={handleCopy} disabled={loading} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '220px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>{copied ? 'check' : 'content_copy'}</span>
                {copied ? 'Copied to Clipboard' : 'Copy Resolution Plan'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
