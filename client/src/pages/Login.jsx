import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { loginUser } from '../api/applications'

const Login = ({ onSwitch }) => {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await loginUser(email, password)
      login(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.shell}>
        <div style={styles.titlebar}>
          <span style={styles.dot('#ff5f57')}></span>
          <span style={styles.dot('#febc2e')}></span>
          <span style={styles.dot('#28c840')}></span>
          <span style={styles.label}>trackr — login</span>
        </div>

        <div style={styles.body}>
          <div style={styles.prompt}>
            <span style={styles.green}>›</span> authenticate to continue
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.fieldLabel}>EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                placeholder="you@example.com"
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.fieldLabel}>PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                placeholder="••••••"
                required
              />
            </div>

            <button type="submit" style={styles.btn} disabled={loading}>
              {loading ? 'authenticating...' : '→ login'}
            </button>
          </form>

          <div style={styles.switchRow}>
            <span style={styles.muted}>no account? </span>
            <span style={styles.switchLink} onClick={onSwitch}>
              register
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    background: '#080808',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'JetBrains Mono', monospace",
  },
  shell: {
    width: '100%',
    maxWidth: '420px',
    background: '#0f0f0f',
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
  }),
  label: {
    fontSize: '11px',
    color: '#555',
    marginLeft: 'auto',
    letterSpacing: '0.06em',
  },
  body: {
    padding: '24px',
  },
  prompt: {
    fontSize: '12px',
    color: '#555',
    marginBottom: '20px',
  },
  green: {
    color: '#4ade80',
    marginRight: '6px',
  },
  error: {
    background: '#1f0a0a',
    border: '1px solid #4a1515',
    color: '#f87171',
    padding: '8px 12px',
    borderRadius: '3px',
    fontSize: '12px',
    marginBottom: '16px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
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
    padding: '8px 12px',
    borderRadius: '3px',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
    outline: 'none',
  },
  btn: {
    background: '#0d1f14',
    border: '1px solid #1a3d24',
    color: '#4ade80',
    padding: '10px',
    borderRadius: '3px',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: '4px',
  },
  switchRow: {
    marginTop: '20px',
    fontSize: '11px',
    textAlign: 'center',
  },
  muted: {
    color: '#555',
  },
  switchLink: {
    color: '#4ade80',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
}

export default Login