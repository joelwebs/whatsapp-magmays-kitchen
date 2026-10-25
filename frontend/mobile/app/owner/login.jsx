import { useState } from 'react'
import { motion } from 'motion/react'
import { Eye, EyeOff } from 'lucide-react'
import Header from '../../components/Header'
import PrimaryButton from '../../components/PrimaryButton'
import { toast } from 'sonner'
import './login.css'

export default function OwnerLoginPage({ onNavigate }) {
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleLogin(e) {
    e.preventDefault()
    if (!emailOrPhone.trim()) {
      toast.error('Please enter your email or phone number')
      return
    }
    if (!password.trim()) {
      toast.error('Please enter your password')
      return
    }
    setLoading(true)
    // For now, show a message since owner auth is not the primary scope
    setTimeout(() => {
      setLoading(false)
      toast.error('Owner login is currently under development')
    }, 1000)
  }

  return (
    <div className="owner-login" id="owner-login-page">
      <Header showBack onBack={() => onNavigate('home')} />

      <div className="owner-login__content">
        <motion.div
          className="owner-login__brand"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="owner-login__logo-box">
            <span className="owner-login__logo-name">Magmay's</span>
            <span className="owner-login__logo-sub">KITCHEN</span>
          </div>
        </motion.div>

        <motion.div
          className="owner-login__header"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="owner-login__title">Owner Login</h1>
          <p className="owner-login__subtitle">Access your dashboard</p>
        </motion.div>

        <motion.form
          className="owner-login__form"
          onSubmit={handleLogin}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="owner-login__field">
            <input
              type="text"
              className="owner-login__input"
              placeholder="Email or Phone Number"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              id="owner-login-email"
              autoComplete="username"
            />
          </div>

          <div className="owner-login__field">
            <div className="owner-login__password-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                className="owner-login__input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="owner-login-password"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="owner-login__eye-btn"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <PrimaryButton
            type="submit"
            size="lg"
            disabled={loading}
            id="owner-login-submit-btn"
          >
            {loading ? 'Logging in...' : 'Login'}
          </PrimaryButton>

          <button
            type="button"
            className="owner-login__forgot"
            onClick={() => toast.info('Please contact support')}
          >
            Forgot password?
          </button>
        </motion.form>
      </div>
    </div>
  )
}
