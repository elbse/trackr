import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  getApplications,
  createApplication,
  deleteApplication,
  updateApplication,
} from '../api/applications'

const STATUS_MAP = {
  applied: { color: '#4ade80', bg: '#0d1f14', border: '#1a3d24' },
  interview: { color: '#a78bfa', bg: '#130f24', border: '#2d1f5a' },
  pending: { color: '#fbbf24', bg: '#1f1500', border: '#3d2d00' },
  rejected: { color: '#f87171', bg: '#1f0a0a', border: '#4a1515' },
  offer: { color: '#60a5fa', bg: '#0a1220', border: '#1a3060' },
}

const FILTERS = ['all', 'applied', 'interview', 'pending', 'offer', 'rejected']

const Dashboard = () => {
  const { user, logout } = useAuth()
  const [apps, setApps] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    company: '',
    role: '',
    position: '',
    status: 'applied',
    notes: '',
  })

  useEffect(() => {
    fetchApps()
  }, [])

  const fetchApps = async () => {
    try {
      const data = await getApplications(user.token)
      setApps(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      const data = await createApplication(user.token, form)
      setApps([data, ...apps])
      setShowModal(false)
      setForm({ company: '', role: '', position: '', status: 'applied', notes: '' })
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteApplication(user.token, id)
      setApps(apps.filter((a) => a._id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      const updated = await updateApplication(user.token, id, { status })
      setApps(apps.map((a) => (a._id === id ? updated : a)))
    } catch (err) {
      console.error(err)
    }
  }

  const filtered = filter === 'all' ? apps : apps.filter((a) => a.status === filter)

  const stats = {
    total: apps.length,
    applied: apps.filter((a) => a.status === 'applied').length,
    interview: apps.filter((a) => a.status === 'interview').length,
    offer: apps.filter((a) => a.status === 'offer').length,
  }

  const fmt = (d) => {
    const date = new Date(d)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div style={s.page}>
      <div style={s.shell}>

        {/* titlebar */}
        <div style={s.titlebar}>
          <span style={s.dot('#ff5f57')} onClick={logout} title="logout"></span>
          <span style={s.dot('#febc2e')}></span>
          <span style={s.dot('#28c840')}></span>
          <span style={s.tlabel}>trackr — {user.name}</span>
        </div>

        {/* stats */}
        <div style={s.statsRow}>
          {[
            { label: 'TOTAL', val: stats.total, color: '#d4d4d4' },
            { label: 'APPLIED', val: stats.applied, color: '#4ade80' },
            { label: 'INTERVIEW', val: stats.interview, color: '#a78bfa' },
            { label: 'OFFER', val: stats.offer, color: '#fbbf24' },
          ].map((stat) => (
            <div key={stat.label} style={s.stat}>
              <div style={s.statLabel}>{stat.label}</div>
              <div style={{ ...s.statVal, color: stat.color }}>{stat.val}</div>
            </div>
          ))}
        </div>

        {/* toolbar */}
        <div style={s.toolbar}>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                ...s.filterBtn,
                ...(filter === f ? s.filterBtnActive : {}),
              }}
            >
              {f}
            </button>
          ))}
          <button style={s.addBtn} onClick={() => setShowModal(true)}>
            + add entry
          </button>
        </div>

        {/* table header */}
        <div style={s.tableHeader}>
          <span>#</span>
          <span>company / role</span>
          <span>position</span>
          <span>status</span>
          <span>date</span>
          <span></span>
        </div>

        {/* rows */}
        <div>
          {loading && (
            <div style={s.empty}>loading applications...</div>
          )}
          {!loading && filtered.length === 0 && (
            <div style={s.empty}>no entries match filter "{filter}"</div>
          )}
          {filtered.map((app, i) => {
            const st = STATUS_MAP[app.status] || STATUS_MAP.pending
            return (
              <div key={app._id} style={s.row}>
                <span style={s.idx}>{i + 1}</span>
                <div>
                  <div style={s.company}>{app.company}</div>
                  <div style={s.role}>{app.role}</div>
                </div>
                <span style={s.colRole}>{app.position}</span>
                <span>
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app._id, e.target.value)}
                    style={{
                      ...s.badge,
                      color: st.color,
                      background: st.bg,
                      border: `1px solid ${st.border}`,
                    }}
                  >
                    {Object.keys(STATUS_MAP).map((status) => (
                      <option key={status} value={status}
                        style={{ background: '#0d0d0d', color: '#d4d4d4' }}>
                        {status}
                      </option>
                    ))}
                  </select>
                </span>
                <span style={s.date}>{fmt(app.date)}</span>
                <span>
                  <button style={s.rmBtn} onClick={() => handleDelete(app._id)}>
                    rm
                  </button>
                </span>
              </div>
            )
          })}
        </div>

        {/* prompt */}
        <div style={s.promptRow}>
          <span style={s.promptSym}>›</span>
          <span style={s.promptText}>
            {stats.total} application{stats.total !== 1 ? 's' : ''} tracked _ filter:{filter}
          </span>
          <span style={s.cursor}></span>
        </div>
      </div>

      {/* modal */}
      {showModal && (
        <div style={s.modalBg}>
          <div style={s.modal}>
            <div style={s.modalTitle}>new application entry</div>

            <form onSubmit={handleCreate} style={s.modalForm}>
              {[
                { label: 'COMPANY', key: 'company', placeholder: 'Acme Corp' },
                { label: 'ROLE', key: 'role', placeholder: 'Frontend Intern' },
                { label: 'POSITION TYPE', key: 'position', placeholder: 'IT / Dev' },
                { label: 'NOTES', key: 'notes', placeholder: 'optional notes' },
              ].map(({ label, key, placeholder }) => (
                <div key={key} style={s.field}>
                  <label style={s.fieldLabel}>{label}</label>
                  <input
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    style={s.input}
                    placeholder={placeholder}
                  />
                </div>
              ))}

              <div style={s.field}>
                <label style={s.fieldLabel}>STATUS</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  style={s.input}
                >
                  {Object.keys(STATUS_MAP).map((status) => (
                    <option key={status} value={status}
                      style={{ background: '#0d0d0d' }}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div style={s.modalActions}>
                <button
                  type="button"
                  style={s.cancelBtn}
                  onClick={() => setShowModal(false)}
                >
                  cancel
                </button>
                <button type="submit" style={s.saveBtn}>
                  save entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const s = {
  page: {
    minHeight: '100vh',
    background: '#080808',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '40px 16px',
    fontFamily: "'JetBrains Mono', monospace",
  },
  shell: {
    width: '100%',
    maxWidth: '900px',
    background: '#080808',
    border: '1px solid #2a2a2a',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  titlebar: {
    background: '#111',
    borderBottom: '1px solid #1e1e1e',
    padding: '10px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  dot: (color) => ({
    width: '11px',
    height: '11px',
    borderRadius: '50%',
    background: color,
    display: 'inline-block',
    cursor: 'pointer',
  }),
  tlabel: {
    fontSize: '11px',
    color: '#555',
    marginLeft: 'auto',
    letterSpacing: '0.06em',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    borderBottom: '1px solid #1e1e1e',
  },
  stat: {
    padding: '12px 14px',
    borderRight: '1px solid #1e1e1e',
  },
  statLabel: {
    fontSize: '10px',
    color: '#555',
    letterSpacing: '0.08em',
    marginBottom: '4px',
  },
  statVal: {
    fontSize: '20px',
    fontWeight: '500',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    borderBottom: '1px solid #1e1e1e',
    background: '#0a0a0a',
    flexWrap: 'wrap',
  },
  filterBtn: {
    background: 'none',
    border: '1px solid #1e1e1e',
    color: '#555',
    cursor: 'pointer',
    padding: '5px 10px',
    borderRadius: '3px',
    fontSize: '10px',
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: '0.06em',
  },
  filterBtnActive: {
    color: '#4ade80',
    borderColor: '#1a3d24',
    background: '#0d1f14',
  },
  addBtn: {
    marginLeft: 'auto',
    background: '#0d1f14',
    border: '1px solid #1a3d24',
    color: '#4ade80',
    cursor: 'pointer',
    padding: '5px 12px',
    borderRadius: '3px',
    fontSize: '11px',
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: '500',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '28px 1fr 140px 120px 80px 60px',
    padding: '8px 14px',
    borderBottom: '1px solid #1e1e1e',
    color: '#333',
    fontSize: '10px',
    letterSpacing: '0.1em',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '28px 1fr 140px 120px 80px 60px',
    padding: '10px 14px',
    borderBottom: '1px solid #1e1e1e',
    alignItems: 'center',
  },
  idx: { color: '#383838', fontSize: '11px' },
  company: { fontSize: '12px', fontWeight: '500', color: '#e8e8e8' },
  role: { fontSize: '11px', color: '#555', marginTop: '2px' },
  colRole: { fontSize: '11px', color: '#555' },
  badge: {
    fontSize: '10px',
    fontWeight: '500',
    padding: '3px 8px',
    borderRadius: '3px',
    fontFamily: "'JetBrains Mono', monospace",
    cursor: 'pointer',
    outline: 'none',
  },
  date: { fontSize: '11px', color: '#555' },
  rmBtn: {
    background: 'none',
    border: '1px solid #2a2a2a',
    color: '#555',
    cursor: 'pointer',
    padding: '4px 6px',
    borderRadius: '3px',
    fontSize: '11px',
    fontFamily: "'JetBrains Mono', monospace",
  },
  empty: {
    padding: '24px 14px',
    color: '#333',
    fontSize: '11px',
  },
  promptRow: {
    padding: '10px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    borderTop: '1px solid #1e1e1e',
  },
  promptSym: { color: '#4ade80', fontSize: '12px' },
  promptText: { fontSize: '11px', color: '#383838' },
  cursor: {
    display: 'inline-block',
    width: '7px',
    height: '13px',
    background: '#4ade80',
    opacity: '0.8',
    animation: 'blink 1s step-end infinite',
    verticalAlign: '-2px',
  },
  modalBg: {
    position: 'fixed',
    inset: '0',
    background: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '10',
  },
  modal: {
    background: '#0d0d0d',
    border: '1px solid #2a2a2a',
    borderRadius: '6px',
    padding: '20px',
    width: '340px',
  },
  modalTitle: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#d4d4d4',
    marginBottom: '16px',
    paddingBottom: '10px',
    borderBottom: '1px solid #1e1e1e',
    fontFamily: "'JetBrains Mono', monospace",
  },
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  fieldLabel: {
    fontSize: '10px',
    color: '#555',
    letterSpacing: '0.08em',
  },
  input: {
    background: '#080808',
    border: '1px solid #2a2a2a',
    color: '#d4d4d4',
    padding: '7px 10px',
    borderRadius: '3px',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
    outline: 'none',
  },
  modalActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '4px',
    paddingTop: '12px',
    borderTop: '1px solid #1e1e1e',
  },
  cancelBtn: {
    flex: '1',
    background: 'none',
    border: '1px solid #2a2a2a',
    color: '#555',
    cursor: 'pointer',
    padding: '7px',
    borderRadius: '3px',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '11px',
  },
  saveBtn: {
    flex: '1',
    background: '#0d1f14',
    border: '1px solid #1a3d24',
    color: '#4ade80',
    cursor: 'pointer',
    padding: '7px',
    borderRadius: '3px',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '11px',
    fontWeight: '500',
  },
}

export default Dashboard