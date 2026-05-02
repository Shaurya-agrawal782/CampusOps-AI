import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { analyzeChatMessage } from '../utils/chatbotUtils';

const QUICK_PROMPTS = [
  "Hostel B me paani nahi aa raha",
  "I need bonafide certificate",
  "Where to report Library WiFi?",
  "Track my ticket",
  "Canteen food smells bad"
];

export default function AIAssistant({ context = 'general' }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hi, I'm CampusOps AI Assistant. Tell me your campus issue or request, and I'll guide you to the right action.",
      isWelcome: true
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleSend = (text) => {
    const userText = typeof text === 'string' ? text : input;
    if (!userText.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const isAdmin = context === 'admin';
      const result = analyzeChatMessage(userText, isAdmin);
      
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: result.reply,
        intent: result.intent,
        category: result.category,
        priority: result.priority,
        campusUnit: result.campusUnit,
        actions: result.suggestedActions
      }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleAction = (actionObj) => {
    if (actionObj.action === 'open_report') {
      const params = new URLSearchParams();
      if (actionObj.prefillText) params.set('prefill', actionObj.prefillText);
      if (actionObj.prefillLocation) params.set('location', actionObj.prefillLocation);
      navigate(`/report?${params.toString()}`);
    } else if (actionObj.action === 'open_application') {
      navigate('/application');
    } else if (actionObj.action === 'track_request') {
      navigate('/track');
    } else if (actionObj.action === 'admin_dashboard') {
      navigate('/admin');
    } else if (actionObj.action === 'qr_zones') {
      navigate('/qr-zones');
    }
    setIsOpen(false);
  };

  return (
    <div className="ai-assistant-container" style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="ai-assistant-window"
            style={{
              background: 'var(--surface)',
              borderRadius: '1.5rem',
              boxShadow: 'var(--shadow-xl)',
              width: '100%',
              maxWidth: '380px',
              height: '600px',
              maxHeight: '80vh',
              marginBottom: '1rem',
              border: '1px solid var(--outline-variant)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{ background: 'var(--ai-gradient)', padding: '1.25rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="material-symbols-outlined filled" style={{ fontSize: '1.5rem' }}>smart_toy</span>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>CampusOps AI</h3>
                  <p style={{ fontSize: '0.75rem', opacity: 0.9, margin: 0 }}>Action Assistant</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', color: 'white', padding: '0.35rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={18} />
              </button>
            </div>

            {/* Chat Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--surface-container-lowest)' }}>
              {messages.map((msg, i) => (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={i} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                  <div style={{
                    background: msg.sender === 'user' ? 'var(--primary)' : 'var(--surface-container)',
                    color: msg.sender === 'user' ? 'white' : 'var(--on-surface)',
                    padding: '0.875rem 1.125rem',
                    borderRadius: '1.25rem',
                    borderBottomRightRadius: msg.sender === 'user' ? '0.25rem' : '1.25rem',
                    borderBottomLeftRadius: msg.sender === 'user' ? '1.25rem' : '0.25rem',
                    fontSize: '0.9375rem',
                    lineHeight: 1.5,
                  }}>
                    {msg.text}
                  </div>
                  
                  {msg.sender === 'bot' && !msg.isWelcome && (
                    <div style={{ marginTop: '0.625rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {msg.intent && <span style={{ fontSize: '0.6875rem', fontWeight: 700, padding: '0.25rem 0.625rem', background: 'var(--secondary-container)', color: 'var(--secondary)', borderRadius: 'var(--radius-full)' }}>{msg.intent}</span>}
                        {msg.priority && <span style={{ fontSize: '0.6875rem', fontWeight: 700, padding: '0.25rem 0.625rem', background: msg.priority==='Critical'?'#ffebee':msg.priority==='High'?'#fff3e0':'#e3f2fd', color: msg.priority==='Critical'?'#b71c1c':msg.priority==='High'?'#e65100':'#1565c0', borderRadius: 'var(--radius-full)' }}>{msg.priority}</span>}
                        {msg.category && <span style={{ fontSize: '0.6875rem', fontWeight: 700, padding: '0.25rem 0.625rem', background: 'var(--surface-container-high)', borderRadius: 'var(--radius-full)' }}>{msg.category}</span>}
                      </div>
                      
                      {msg.actions?.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
                          {msg.actions.map((act, actIdx) => (
                            <button key={actIdx} onClick={() => handleAction(act)}
                              style={{ padding: '0.625rem 1rem', background: 'var(--surface)', border: '1px solid var(--ai-teal)', color: 'var(--ai-teal)', borderRadius: 'var(--radius-full)', fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer', textAlign: 'center', transition: 'all 150ms' }}
                              onMouseOver={e => { e.currentTarget.style.background = 'var(--ai-teal)'; e.currentTarget.style.color = 'white'; }}
                              onMouseOut={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.color = 'var(--ai-teal)'; }}
                            >
                              {act.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
              
              {isTyping && (
                <div style={{ alignSelf: 'flex-start', background: 'var(--surface-container)', padding: '0.875rem 1.125rem', borderRadius: '1.25rem', borderBottomLeftRadius: '0.25rem', display: 'flex', gap: '0.35rem', alignItems: 'center', height: '2.5rem' }}>
                  <div className="typing-dot" style={{ width: '6px', height: '6px', background: 'var(--outline)', borderRadius: '50%', animation: 'typing 1.4s infinite ease-in-out both' }} />
                  <div className="typing-dot" style={{ width: '6px', height: '6px', background: 'var(--outline)', borderRadius: '50%', animation: 'typing 1.4s infinite ease-in-out both', animationDelay: '0.2s' }} />
                  <div className="typing-dot" style={{ width: '6px', height: '6px', background: 'var(--outline)', borderRadius: '50%', animation: 'typing 1.4s infinite ease-in-out both', animationDelay: '0.4s' }} />
                </div>
              )}
              <div ref={messagesEndRef} style={{ height: '1px' }} />
            </div>

            {/* Quick Prompts */}
            {!isTyping && messages.length < 3 && (
              <div style={{ padding: '0.75rem 1rem', display: 'flex', overflowX: 'auto', gap: '0.5rem', borderTop: '1px solid var(--surface-container-high)', background: 'var(--surface)' }} className="hide-scrollbar">
                {QUICK_PROMPTS.map((p, i) => (
                  <button key={i} onClick={() => handleSend(p)} style={{ whiteSpace: 'nowrap', padding: '0.375rem 0.875rem', background: 'var(--surface-container)', border: '1px solid var(--outline-variant)', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--on-surface)', cursor: 'pointer', flexShrink: 0, transition: 'all 150ms' }}
                    onMouseOver={e => e.currentTarget.style.background = 'var(--surface-container-high)'}
                    onMouseOut={e => e.currentTarget.style.background = 'var(--surface-container)'}>
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div style={{ padding: '1rem', borderTop: '1px solid var(--surface-container-high)', display: 'flex', gap: '0.75rem', background: 'var(--surface)' }}>
              <input 
                type="text" 
                value={input} 
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask CampusOps AI..."
                style={{ flex: 1, padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--outline-variant)', fontSize: '0.9375rem', outline: 'none', background: 'var(--surface-container-lowest)' }}
              />
              <button 
                onClick={() => handleSend()}
                disabled={!input.trim()}
                style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: input.trim() ? 'var(--primary)' : 'var(--surface-container-high)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() ? 'pointer' : 'default', transition: 'all 200ms', flexShrink: 0 }}
              >
                <Send size={18} style={{ marginLeft: '2px' }} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '4rem',
          height: '4rem',
          borderRadius: '50%',
          background: 'var(--ai-gradient)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(14,165,164,0.3)',
          position: 'relative'
        }}
      >
        {isOpen ? <X size={24} /> : <Sparkles size={24} />}
        {!isOpen && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{
              position: 'absolute',
              top: '0',
              right: '0',
              width: '14px',
              height: '14px',
              background: 'var(--error)',
              borderRadius: '50%',
              border: '2px solid white'
            }}
          />
        )}
      </motion.button>

      <style>{`
        @keyframes typing {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
