import { useState } from 'react'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

const App = () => {
  const { user } = useAuth()
  const [showLogin, setShowLogin] = useState(true)

  if (user) {
    return <Dashboard />
  }

  if (showLogin) {
    return <Login onSwitch={() => setShowLogin(false)} />
  }

  return <Register onSwitch={() => setShowLogin(true)} />
}

export default App