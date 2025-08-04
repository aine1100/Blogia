import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
      // TODO: Implement actual login API call
      console.log('Login attempt:', formData)
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Redirect to dashboard after successful login
      window.location.href = '/dashboard'
    } catch (err) {
      setError('Invalid email or password')
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
                htmlFor="email" 
                style={{ 
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'var(--black)',
                  marginBottom: '8px'
                }}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                placeholder="Enter your email"
                required
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