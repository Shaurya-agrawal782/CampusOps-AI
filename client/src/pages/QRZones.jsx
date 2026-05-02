import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../context/AuthContext';

const QR_ZONES = [
  { name: 'Hostel B', unit: 'Hostel Warden / Maintenance' },
  { name: 'Central Library', unit: 'Library Office' },
  { name: 'Main Canteen', unit: 'Canteen Committee' },
  { name: 'Computer Lab 2', unit: 'IT Support' },
  { name: 'Block A Room 204', unit: 'Academic Block Maintenance' },
  { name: 'Girls Hostel Road', unit: 'Campus Security Office' },
];

export default function QRZones() {
  const [copiedLink, setCopiedLink] = useState(null);

  const handleCopy = (name) => {
    const reportUrl = `${window.location.origin}/report?location=${encodeURIComponent(name)}`;
    navigator.clipboard.writeText(reportUrl);
    setCopiedLink(name);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', background: 'var(--surface)', paddingBottom: '4rem' }}>
      <div className="container" style={{ maxWidth: '1200px', paddingTop: '2.5rem' }}>
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'var(--primary-container)', color: 'var(--primary)',
            padding: '0.375rem 1rem', borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em',
            textTransform: 'uppercase', marginBottom: '1rem',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>qr_code_scanner</span>
            QR-Based Reporting
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
            Campus QR Zones
          </h1>
          <p style={{ fontSize: '1.0625rem', color: 'var(--on-surface-variant)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            Place these QR codes near campus locations. Students can scan them to report issues with the location auto-filled instantly.
          </p>
        </motion.div>

        {/* QR Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {QR_ZONES.map((zone, i) => {
            const reportUrl = `${window.location.origin}/report?location=${encodeURIComponent(zone.name)}`;

            return (
              <motion.div 
                key={zone.name}
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card" 
                style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <div style={{ width: '100%', textAlign: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--on-surface)', marginBottom: '0.25rem' }}>{zone.name}</h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)', fontWeight: 600 }}>{zone.unit}</p>
                </div>

                <div style={{ 
                  background: 'white', padding: '1rem', borderRadius: 'var(--radius-lg)', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '1.5rem',
                  border: '1px solid var(--surface-container-high)'
                }}>
                  <QRCodeSVG 
                    value={reportUrl} 
                    size={180}
                    level="Q"
                    includeMargin={false}
                    fgColor="#00236f" 
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                  <a 
                    href={reportUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary" 
                    style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>open_in_new</span>
                    Open Report Link
                  </a>
                  
                  <button 
                    onClick={() => handleCopy(zone.name)}
                    className="btn btn-outline"
                    style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', position: 'relative' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>
                      {copiedLink === zone.name ? 'check' : 'content_copy'}
                    </span>
                    {copiedLink === zone.name ? 'Link Copied!' : 'Copy Report Link'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
