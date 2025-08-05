import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'

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
  const [success, setSuccess] = useState('')
  const { register } = useAuth()
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
    setSuccess('')

    if (formData.password !== formData.confirmPassword) {
      const errorMessage = 'Passwords do not match'
      setError(errorMessage)
      toast.error(errorMessage)
      setLoading(false)
      return
    }

    try {
      const {  ...registerData } = formData
      const result = await register(registerData)
      
      if (result.success) {
        const successMessage = 'Account created successfully! Please sign in.'
        setSuccess(successMessage)
        toast.success(successMessage)
        setTimeout(() => {
          navigate('/login')
        }, 2000)
        
      } else {
        const errorMessage = result.error || 'Registration failed'
        setError(errorMessage)
        toast.error(errorMessage)
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
      console.error('Registration error:', err)
    } finally {
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

          {success && (
            <div className="success mb-6">{success}</div>
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
                style={{outline:"none"}}
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
                style={{outline:"none"}}

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
                style={{outline:"none"}}

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
                style={{outline:"none"}}

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
                style={{outline:"none"}}

              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '16px',outline:"none" }}
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