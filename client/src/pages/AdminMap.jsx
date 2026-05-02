import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import { grievanceAPI } from '../services/api';
import {
  DEMO_TICKETS,
  campusLocationCoordinates,
  CAMPUS_CENTER,
} from '../data/demoData';

// ─── Fix broken default Leaflet marker icon paths ───────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// ─── Priority → circle colour ────────────────────────────────────────────────
const PRIORITY_COLORS = {
  critical: '#ff1744',  // red
  high:     '#ff6d00',  // orange
  medium:   '#2979ff',  // blue
  low:      '#9e9e9e',  // gray
};

const getPriorityColor = (priority) =>
  PRIORITY_COLORS[priority] || PRIORITY_COLORS.medium;

/**
 * Resolve lat/lng from a ticket's location.address string.
 * 1. Exact match in campusLocationCoordinates
 * 2. Partial / fuzzy match (substring)
 * 3. Campus centre as final fallback
 */
function resolveCoordinates(address = '') {
  if (!address) return CAMPUS_CENTER;

  // 1. Exact key match
  if (campusLocationCoordinates[address]) return campusLocationCoordinates[address];

  // 2. Substring / fuzzy match
  for (const [key, coords] of Object.entries(campusLocationCoordinates)) {
    if (
      address.toLowerCase().includes(key.toLowerCase()) ||
      key.toLowerCase().includes(address.toLowerCase())
    ) {
      return coords;
    }
  }

  // 3. Fallback
  return CAMPUS_CENTER;
}

export default function AdminMap() {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [stats, setStats]           = useState({ critical: 0, high: 0, medium: 0, low: 0 });

  useEffect(() => { loadGrievances(); }, []);

  const loadGrievances = async () => {
    try {
      const res  = await grievanceAPI.getAll({ limit: 100 });
      const raw  = res.data.grievances ?? [];
      processData(raw.length ? raw : DEMO_TICKETS);
    } catch {
      // API unavailable — fall back to demo data
      processData(DEMO_TICKETS);
    } finally {
      setLoading(false);
    }
  };

  const processData = (tickets) => {
    const data = tickets.map((g) => {
      const address = g.location?.address || g.location || '';
      const { lat, lng } = resolveCoordinates(address);
      return { ...g, lat, lng, resolvedAddress: address };
    });

    setGrievances(data);

    const counts = data.reduce(
      (acc, g) => {
        const p = g.priority || 'medium';
        acc[p] = (acc[p] || 0) + 1;
        return acc;
      },
      { critical: 0, high: 0, medium: 0, low: 0 }
    );
    setStats(counts);
  };

  return (
    <div className="admin-layout" style={{ height: '100vh', overflow: 'hidden' }}>
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Command Center</h2>
          <p>Real-time Intelligence</p>
        </div>
        <nav className="sidebar-nav">
          <Link to="/admin"          className="sidebar-link"><span className="material-symbols-outlined">grid_view</span>Overview</Link>
          <Link to="/admin"          className="sidebar-link"><span className="material-symbols-outlined">description</span>Request Feed</Link>
          <Link to="/admin/map"      className="sidebar-link active"><span className="material-symbols-outlined">map</span>Live Crisis Map</Link>
          <Link to="/admin/analytics" className="sidebar-link"><span className="material-symbols-outlined">analytics</span>Analytics</Link>
        </nav>

        {/* Active-alert counters */}
        <div className="sidebar-footer">
          <div style={{ padding: '1rem', background: 'var(--surface-container)', borderRadius: 'var(--radius-md)' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>Active Alerts</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { label: 'Critical',  key: 'critical', color: PRIORITY_COLORS.critical },
                { label: 'High',      key: 'high',     color: PRIORITY_COLORS.high     },
                { label: 'Medium',    key: 'medium',   color: PRIORITY_COLORS.medium   },
                { label: 'Low',       key: 'low',      color: PRIORITY_COLORS.low      },
              ].map(({ label, key, color }) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                  <span style={{ color }}>{label}</span>
                  <span style={{ fontWeight: 700 }}>{stats[key] ?? 0}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main map area ────────────────────────────────────────────────── */}
      <main className="admin-content" style={{ padding: 0, position: 'relative' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <div className="spinner" style={{ width: '3rem', height: '3rem' }} />
          </div>
        ) : (
          <>
            <MapContainer
              center={[CAMPUS_CENTER.lat, CAMPUS_CENTER.lng]}
              zoom={16}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {grievances.map((g) => (
                <CircleMarker
                  key={g._id}
                  center={[g.lat, g.lng]}
                  radius={g.priority === 'critical' ? 14 : g.priority === 'high' ? 11 : 8}
                  pathOptions={{
                    fillColor:   getPriorityColor(g.priority),
                    color:       'white',
                    weight:      2,
                    fillOpacity: 0.85,
                  }}
                >
                  <Popup minWidth={220}>
                    <div style={{ fontFamily: 'inherit' }}>
                      {/* Priority badge */}
                      <span style={{
                        display:      'inline-block',
                        padding:      '2px 8px',
                        borderRadius: '999px',
                        fontSize:     '0.7rem',
                        fontWeight:   700,
                        marginBottom: '0.4rem',
                        textTransform:'uppercase',
                        letterSpacing:'0.05em',
                        color:        'white',
                        background:   getPriorityColor(g.priority),
                      }}>
                        {g.priority ?? 'unknown'}
                      </span>

                      <h4 style={{ margin: '0 0 0.35rem', fontWeight: 700, fontSize: '0.875rem', lineHeight: 1.3 }}>
                        {g.title}
                      </h4>

                      <table style={{ width: '100%', fontSize: '0.75rem', borderCollapse: 'collapse' }}>
                        <tbody>
                          {[
                            ['🎫 Ticket ID',    g.trackingId || g._id],
                            ['📂 Category',     g.category],
                            ['🏢 Campus Unit',  g.aiClassification?.campusUnit || g.department],
                            ['📍 Location',     g.resolvedAddress || '—'],
                            ['🔄 Status',       g.status],
                          ].map(([label, value]) => (
                            <tr key={label}>
                              <td style={{ color: '#666', paddingRight: '0.5rem', paddingBottom: '0.2rem', whiteSpace: 'nowrap' }}>{label}</td>
                              <td style={{ fontWeight: 600 }}>{value || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <Link
                        to={`/admin/grievance/${g._id}`}
                        className="btn btn-primary btn-sm"
                        style={{ display: 'block', textAlign: 'center', marginTop: '0.6rem' }}
                      >
                        View Details
                      </Link>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>

            {/* ── Legend overlay ─────────────────────────────────────────── */}
            <div style={{
              position:     'absolute',
              top:          '1.5rem',
              right:        '1.5rem',
              zIndex:       1000,
              background:   'white',
              padding:      '1rem',
              borderRadius: 'var(--radius-lg)',
              boxShadow:    '0 10px 25px rgba(0,0,0,0.12)',
              border:       '1px solid var(--outline-variant)',
              minWidth:     '170px',
            }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                Campus Hotspot Map
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {[
                  { color: PRIORITY_COLORS.critical, label: 'Critical' },
                  { color: PRIORITY_COLORS.high,     label: 'High Priority' },
                  { color: PRIORITY_COLORS.medium,   label: 'Medium' },
                  { color: PRIORITY_COLORS.low,      label: 'Low / Routine' },
                ].map(({ color, label }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: color, flexShrink: 0 }} />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Demo-mode note ─────────────────────────────────────────── */}
            <div style={{
              position:     'absolute',
              bottom:       '1.25rem',
              left:         '50%',
              transform:    'translateX(-50%)',
              zIndex:       1000,
              background:   'rgba(0,0,0,0.62)',
              color:        'white',
              padding:      '0.4rem 1rem',
              borderRadius: '999px',
              fontSize:     '0.72rem',
              letterSpacing:'0.01em',
              pointerEvents:'none',
              whiteSpace:   'nowrap',
            }}>
              🗺️ Demo campus coordinates shown for hackathon walkthrough.
            </div>
          </>
        )}
      </main>
    </div>
  );
}
