import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    password: '',
    confirmPassword: ''
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      // TODO: Implement actual register API call
      console.log('Register attempt:', formData)
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Redirect to dashboard after successful registration
      window.location.href = '/dashboard'
    } catch (err) {
      setError('Registration failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
      <div className="container">
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div className="text-center mb-8">
            <h1 className="mb-4" style={{ fontSize: '2rem', fontWeight: '600' }}>
              Create account
            </h1>
            <p style={{ color: 'var(--gray-600)' }}>
              Join our community of writers and readers
            </p>
          </div>

          {error && (
            <div className="error mb-6">{error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label 
                htmlFor="full_name" 
                style={{ 
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'var(--black)',
                  marginBottom: '8px'
                }}
              >
                Full name
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="input"
                placeholder="Enter your full name"
                required
              />
            </div>

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
                placeholder="Choose a username"
                required
              />
            </div>

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

            <div style={{ marginBottom: '20px' }}>
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
                placeholder="Create a password"
                required
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label 
                htmlFor="confirmPassword" 
                style={{ 
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'var(--black)',
                  marginBottom: '8px'
                }}
              >
                Confirm password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input"
                placeholder="Confirm your password"
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
                  Create account
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="text-center">
            <p style={{ color: 'var(--gray-600)', fontSize: '14px' }}>
              Already have an account?{' '}
              <Link 
                to="/login" 
                style={{ 
                  color: 'var(--black)', 
                  fontWeight: '500',
                  textDecoration: 'none'
                }}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register