import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await login(formData.username, formData.password)
      
      if (result.success) {
        toast.success('Welcome back! Login successful.')
        // Redirect to dashboard after successful login
        navigate('/dashboard')
      } else {
        const errorMessage = result.error || 'Login failed'
        setError(errorMessage)
        toast.error(errorMessage)
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container">
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div className="text-center mb-8">
            <h1 className="mb-4" style={{ fontSize: '2rem', fontWeight: '600' }}>
              Welcome back
            </h1>
            <p style={{ color: 'var(--gray-600)' }}>
              Sign in to your account to continue
            </p>
          </div>

          {error && (
            <div className="error mb-6">{error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label 
                htmlFor="username" 
                style={{ 
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'var(--black)',
                  marginBottom: '8px'
                }}
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input"
                placeholder="Enter your username"
                required
                style={{outline:"none"}}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label 
                htmlFor="password" 
                style={{ 
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'var(--black)',
                  marginBottom: '8px'
                }}
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input"
                placeholder="Enter your password"
                required
                style={{outline:"none"}}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '16px' }}
            >
              {loading ? (
                <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="text-center">
            <p style={{ color: 'var(--gray-600)', fontSize: '14px' }}>
              Don't have an account?{' '}
              <Link 
                to="/register" 
                style={{ 
                  color: 'var(--black)', 
                  fontWeight: '500',
                  textDecoration: 'none'
                }}
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login