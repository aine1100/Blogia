import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Users, Search, Download, Mail, Calendar, TrendingUp, UserPlus } from 'lucide-react'

function DashboardSubscribers() {
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [timeRange, setTimeRange] = useState('30d')
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    growth: 0
  })

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const fetchSubscribers = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setStats({
        total: 156,
        thisMonth: 23,
        growth: 18.5
      })

      setSubscribers([
        {
          id: 1,
          email: "alice.johnson@example.com",
          name: "Alice Johnson",
          subscribed_at: "2024-01-20T10:30:00Z",
          status: "active",
          source: "website"
        },
        {
          id: 2,
          email: "bob.smith@example.com",
          name: "Bob Smith",
          subscribed_at: "2024-01-18T15:45:00Z",
          status: "active",
          source: "social"
        },
        {
          id: 3,
          email: "carol.davis@example.com",
          name: "Carol Davis",
          subscribed_at: "2024-01-15T09:20:00Z",
          status: "active",
          source: "website"
        },
        {
          id: 4,
          email: "david.wilson@example.com",
          name: "David Wilson",
          subscribed_at: "2024-01-12T14:30:00Z",
          status: "active",
          source: "referral"
        },
        {
          id: 5,
          email: "emma.brown@example.com",
          name: "Emma Brown",
          subscribed_at: "2024-01-10T11:15:00Z",
          status: "active",
          source: "website"
        },
        {
          id: 6,
          email: "frank.miller@example.com",
          name: "Frank Miller",
          subscribed_at: "2024-01-08T16:45:00Z",
          status: "unsubscribed",
          source: "social"
        }
      ])
      
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getSourceColor = (source) => {
    const colors = {
      website: { bg: '#f0fdf4', color: '#059669' },
      social: { bg: '#eff6ff', color: '#2563eb' },
      referral: { bg: '#fef3c7', color: '#d97706' }
    }
    return colors[source] || { bg: '#f3f4f6', color: '#6b7280' }
  }

  const filteredSubscribers = subscribers.filter(subscriber => 
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscriber.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="container">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link 
                to="/dashboard"
                className="flex items-center gap-2"
                style={{ 
                  color: 'var(--gray-600)',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'color 0.15s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = 'var(--black)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--gray-600)'}
              >
                <ArrowLeft size={16} />
                Back to dashboard
              </Link>
              
              <h1 style={{ 
                fontSize: '2.5rem', 
                fontWeight: '700',
                color: 'var(--black)'
              }}>
                Subscribers
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="input"
                style={{ width: 'auto', minWidth: '120px' }}
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              
              <button className="btn btn-secondary">
                <Download size={16} />
                Export
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-3 gap-6 mb-8">
            <div style={{ 
              background: 'var(--white)', 
              padding: '24px', 
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <div className="flex items-center justify-between mb-4">
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'var(--gray-100)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gray-600)'
                }}>
                  <Users size={20} />
                </div>
                <span style={{ 
                  fontSize: '12px', 
                  color: '#10b981',
                  background: '#f0fdf4',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontWeight: '500'
                }}>
                  +{stats.growth}%
                </span>
              </div>
              <div style={{ 
                fontSize: '32px', 
                fontWeight: '700',
                color: 'var(--black)',
                marginBottom: '4px'
              }}>
                {stats.total}
              </div>
              <p style={{ color: 'var(--gray-600)', fontSize: '14px' }}>
                Total subscribers
              </p>
            </div>

            <div style={{ 
              background: 'var(--white)', 
              padding: '24px', 
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <div className="flex items-center justify-between mb-4">
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'var(--gray-100)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gray-600)'
                }}>
                  <UserPlus size={20} />
                </div>
              </div>
              <div style={{ 
                fontSize: '32px', 
                fontWeight: '700',
                color: 'var(--black)',
                marginBottom: '4px'
              }}>
                {stats.thisMonth}
              </div>
              <p style={{ color: 'var(--gray-600)', fontSize: '14px' }}>
                New this month
              </p>
            </div>

            <div style={{ 
              background: 'var(--white)', 
              padding: '24px', 
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <div className="flex items-center justify-between mb-4">
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'var(--gray-100)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gray-600)'
                }}>
                  <TrendingUp size={20} />
                </div>
              </div>
              <div style={{ 
                fontSize: '32px', 
                fontWeight: '700',
                color: 'var(--black)',
                marginBottom: '4px'
              }}>
                {((subscribers.filter(s => s.status === 'active').length / subscribers.length) * 100).toFixed(1)}%
              </div>
              <p style={{ color: 'var(--gray-600)', fontSize: '14px' }}>
                Active rate
              </p>
            </div>
          </div>

          {/* Search */}
          <div style={{ 
            background: 'var(--white)', 
            padding: '20px', 
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            marginBottom: '24px'
          }}>
            <div className="flex items-center justify-between">
              <div style={{ position: 'relative', minWidth: '300px' }}>
                <Search size={16} style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: 'var(--gray-400)'
                }} />
                <input
                  type="text"
                  placeholder="Search subscribers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input"
                  style={{ paddingLeft: '40px' }}
                />
              </div>

              <button className="btn btn-primary">
                <Mail size={16} />
                Send newsletter
              </button>
            </div>
          </div>

          {/* Subscribers List */}
          {filteredSubscribers.length === 0 ? (
            <div className="text-center py-16">
              <div style={{
                width: '80px',
                height: '80px',
                background: 'var(--gray-100)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                color: 'var(--gray-400)'
              }}>
                <Users size={32} />
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>
                {searchTerm ? 'No subscribers found' : 'No subscribers yet'}
              </h3>
              <p style={{ color: 'var(--gray-600)', marginBottom: '32px' }}>
                {searchTerm 
                  ? 'Try adjusting your search terms.'
                  : 'Start creating great content to attract subscribers.'
                }
              </p>
            </div>
          ) : (
            <div style={{ 
              background: 'var(--white)', 
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden'
            }}>
              {/* Table Header */}
              <div style={{ 
                padding: '16px 24px',
                background: 'var(--gray-50)',
                borderBottom: '1px solid var(--gray-100)',
                fontSize: '12px',
                fontWeight: '600',
                color: 'var(--gray-600)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                <div className="grid" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '16px' }}>
                  <div>Subscriber</div>
                  <div>Source</div>
                  <div>Status</div>
                  <div>Joined</div>
                </div>
              </div>

              {/* Table Body */}
              {filteredSubscribers.map((subscriber, index) => (
                <div 
                  key={subscriber.id}
                  style={{ 
                    padding: '20px 24px',
                    borderBottom: index < filteredSubscribers.length - 1 ? '1px solid var(--gray-100)' : 'none'
                  }}
                >
                  <div className="grid" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '16px', alignItems: 'center' }}>
                    <div>
                      <div className="flex items-center gap-3">
                        <div style={{
                          width: '40px',
                          height: '40px',
                          background: 'var(--gray-200)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--gray-600)',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}>
                          {subscriber.name.charAt(0)}
                        </div>
                        <div>
                          <p style={{ 
                            fontSize: '14px', 
                            fontWeight: '600',
                            color: 'var(--black)',
                            marginBottom: '2px'
                          }}>
                            {subscriber.name}
                          </p>
                          <p style={{ 
                            fontSize: '12px', 
                            color: 'var(--gray-500)'
                          }}>
                            {subscriber.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <span 
                        className="badge"
                        style={{
                          background: getSourceColor(subscriber.source).bg,
                          color: getSourceColor(subscriber.source).color,
                          fontSize: '11px',
                          padding: '4px 8px',
                          textTransform: 'capitalize'
                        }}
                      >
                        {subscriber.source}
                      </span>
                    </div>

                    <div>
                      <span 
                        className="badge"
                        style={{
                          background: subscriber.status === 'active' ? '#f0fdf4' : '#fef2f2',
                          color: subscriber.status === 'active' ? '#059669' : '#dc2626',
                          fontSize: '11px',
                          padding: '4px 8px',
                          textTransform: 'capitalize'
                        }}
                      >
                        {subscriber.status}
                      </span>
                    </div>

                    <div>
                      <p style={{ fontSize: '12px', color: 'var(--gray-500)' }}>
                        {formatDate(subscriber.subscribed_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Growth Chart Placeholder */}
          <div style={{ 
            background: 'var(--white)', 
            padding: '24px', 
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            marginTop: '24px'
          }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600',
              color: 'var(--black)',
              marginBottom: '16px'
            }}>
              Subscriber growth
            </h3>
            <div style={{ 
              height: '200px',
              background: 'var(--gray-50)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--gray-500)'
            }}>
              <div className="text-center">
                <TrendingUp size={32} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                <p>Growth chart visualization coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardSubscribers