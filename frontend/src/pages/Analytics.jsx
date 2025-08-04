import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, TrendingUp, Eye, Users, Heart, MessageCircle, Calendar, Download } from 'lucide-react'

function Analytics() {
  const [timeRange, setTimeRange] = useState('30d')
  const [analytics, setAnalytics] = useState({
    overview: {
      totalViews: 12847,
      totalLikes: 892,
      totalComments: 234,
      totalShares: 156,
      viewsChange: 23.5,
      likesChange: 12.8,
      commentsChange: -5.2,
      sharesChange: 8.9
    },
    topPosts: [],
    viewsOverTime: [],
    audienceGrowth: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setAnalytics({
        ...analytics,
        topPosts: [
          {
            id: 1,
            title: "Building Modern Web Applications with FastAPI",
            views: 3421,
            likes: 187,
            comments: 45,
            shares: 23,
            published_at: "2024-01-15T10:30:00Z"
          },
          {
            id: 2,
            title: "The Art of Minimal Design",
            views: 2156,
            likes: 134,
            comments: 28,
            shares: 19,
            published_at: "2024-01-12T15:45:00Z"
          },
          {
            id: 3,
            title: "Understanding User Experience Through Data",
            views: 1892,
            likes: 98,
            comments: 22,
            shares: 15,
            published_at: "2024-01-10T09:20:00Z"
          },
          {
            id: 4,
            title: "API Design Best Practices",
            views: 1654,
            likes: 87,
            comments: 19,
            shares: 12,
            published_at: "2024-01-08T14:30:00Z"
          }
        ]
      })
      
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

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
                Analytics
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

          {/* Overview Stats */}
          <div className="grid grid-2 lg:grid-cols-4 gap-6 mb-12">
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
                  <Eye size={20} />
                </div>
                <span style={{ 
                  fontSize: '12px', 
                  color: analytics.overview.viewsChange > 0 ? '#10b981' : '#ef4444',
                  background: analytics.overview.viewsChange > 0 ? '#f0fdf4' : '#fef2f2',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontWeight: '500'
                }}>
                  {analytics.overview.viewsChange > 0 ? '+' : ''}{analytics.overview.viewsChange}%
                </span>
              </div>
              <div style={{ 
                fontSize: '32px', 
                fontWeight: '700',
                color: 'var(--black)',
                marginBottom: '4px'
              }}>
                {formatNumber(analytics.overview.totalViews)}
              </div>
              <p style={{ color: 'var(--gray-600)', fontSize: '14px' }}>
                Total views
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
                  <Heart size={20} />
                </div>
                <span style={{ 
                  fontSize: '12px', 
                  color: analytics.overview.likesChange > 0 ? '#10b981' : '#ef4444',
                  background: analytics.overview.likesChange > 0 ? '#f0fdf4' : '#fef2f2',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontWeight: '500'
                }}>
                  {analytics.overview.likesChange > 0 ? '+' : ''}{analytics.overview.likesChange}%
                </span>
              </div>
              <div style={{ 
                fontSize: '32px', 
                fontWeight: '700',
                color: 'var(--black)',
                marginBottom: '4px'
              }}>
                {formatNumber(analytics.overview.totalLikes)}
              </div>
              <p style={{ color: 'var(--gray-600)', fontSize: '14px' }}>
                Total likes
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
                  <MessageCircle size={20} />
                </div>
                <span style={{ 
                  fontSize: '12px', 
                  color: analytics.overview.commentsChange > 0 ? '#10b981' : '#ef4444',
                  background: analytics.overview.commentsChange > 0 ? '#f0fdf4' : '#fef2f2',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontWeight: '500'
                }}>
                  {analytics.overview.commentsChange > 0 ? '+' : ''}{analytics.overview.commentsChange}%
                </span>
              </div>
              <div style={{ 
                fontSize: '32px', 
                fontWeight: '700',
                color: 'var(--black)',
                marginBottom: '4px'
              }}>
                {formatNumber(analytics.overview.totalComments)}
              </div>
              <p style={{ color: 'var(--gray-600)', fontSize: '14px' }}>
                Total comments
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
                <span style={{ 
                  fontSize: '12px', 
                  color: analytics.overview.sharesChange > 0 ? '#10b981' : '#ef4444',
                  background: analytics.overview.sharesChange > 0 ? '#f0fdf4' : '#fef2f2',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontWeight: '500'
                }}>
                  {analytics.overview.sharesChange > 0 ? '+' : ''}{analytics.overview.sharesChange}%
                </span>
              </div>
              <div style={{ 
                fontSize: '32px', 
                fontWeight: '700',
                color: 'var(--black)',
                marginBottom: '4px'
              }}>
                {formatNumber(analytics.overview.totalShares)}
              </div>
              <p style={{ color: 'var(--gray-600)', fontSize: '14px' }}>
                Total shares
              </p>
            </div>
          </div>

          {/* Top Posts */}
          <div className="mb-12">
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '600',
              color: 'var(--black)',
              marginBottom: '24px'
            }}>
              Top performing posts
            </h2>

            <div style={{ 
              background: 'var(--white)', 
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden'
            }}>
              {analytics.topPosts.map((post, index) => (
                <div 
                  key={post.id}
                  style={{ 
                    padding: '20px 24px',
                    borderBottom: index < analytics.topPosts.length - 1 ? '1px solid var(--gray-100)' : 'none'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div style={{ flex: 1 }}>
                      <div className="flex items-center gap-3 mb-2">
                        <span style={{ 
                          fontSize: '14px', 
                          fontWeight: '600',
                          color: 'var(--gray-500)',
                          minWidth: '20px'
                        }}>
                          #{index + 1}
                        </span>
                        <Link 
                          to={`/post/${post.id}`}
                          style={{ 
                            fontSize: '16px', 
                            fontWeight: '600',
                            color: 'var(--black)',
                            textDecoration: 'none',
                            transition: 'color 0.15s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.color = 'var(--gray-600)'}
                          onMouseLeave={(e) => e.target.style.color = 'var(--black)'}
                        >
                          {post.title}
                        </Link>
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--gray-500)' }}>
                        Published {formatDate(post.published_at)}
                      </p>
                    </div>

                    <div className="flex items-center gap-6" style={{ fontSize: '14px', color: 'var(--gray-600)' }}>
                      <div className="flex items-center gap-1">
                        <Eye size={14} />
                        <span>{formatNumber(post.views)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart size={14} />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle size={14} />
                        <span>{post.comments}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp size={14} />
                        <span>{post.shares}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Charts Placeholder */}
          <div className="grid grid-2 gap-8">
            <div style={{ 
              background: 'var(--white)', 
              padding: '24px', 
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600',
                color: 'var(--black)',
                marginBottom: '16px'
              }}>
                Views over time
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
                  <p>Chart visualization coming soon</p>
                </div>
              </div>
            </div>

            <div style={{ 
              background: 'var(--white)', 
              padding: '24px', 
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600',
                color: 'var(--black)',
                marginBottom: '16px'
              }}>
                Audience growth
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
                  <Users size={32} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                  <p>Chart visualization coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics