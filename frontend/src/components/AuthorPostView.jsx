import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Edit3, BarChart3, Eye, Heart, MessageCircle, Share2, Settings, MoreHorizontal } from 'lucide-react'

function AuthorPostView({ post, stats }) {
  const [showMenu, setShowMenu] = useState(false)

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  return (
    <div style={{
      background: 'var(--gray-50)',
      padding: '16px 24px',
      borderRadius: '12px',
      marginBottom: '32px',
      border: '2px solid var(--primary)',
      position: 'relative'
    }}>
      {/* Author Badge */}
      <div style={{
        position: 'absolute',
        top: '-12px',
        left: '24px',
        background: 'var(--primary)',
        color: 'white',
        padding: '4px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '600'
      }}>
        Your post
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Stats */}
          <div className="flex items-center gap-4" style={{ fontSize: '14px' }}>
            <div className="flex items-center gap-1" style={{ color: 'var(--gray-600)' }}>
              <Eye size={16} />
              <span style={{ fontWeight: '600' }}>{formatNumber(stats.views)}</span>
              <span>views</span>
            </div>
            <div className="flex items-center gap-1" style={{ color: 'var(--gray-600)' }}>
              <Heart size={16} />
              <span style={{ fontWeight: '600' }}>{stats.likes}</span>
              <span>likes</span>
            </div>
            <div className="flex items-center gap-1" style={{ color: 'var(--gray-600)' }}>
              <MessageCircle size={16} />
              <span style={{ fontWeight: '600' }}>{stats.comments}</span>
              <span>comments</span>
            </div>
            <div className="flex items-center gap-1" style={{ color: 'var(--gray-600)' }}>
              <Share2 size={16} />
              <span style={{ fontWeight: '600' }}>{stats.shares}</span>
              <span>shares</span>
            </div>
          </div>

          {/* Status */}
          <span 
            className="badge"
            style={{
              background: post.is_published ? '#f0fdf4' : '#fef3c7',
              color: post.is_published ? '#059669' : '#92400e',
              fontSize: '12px',
              padding: '4px 8px',
              fontWeight: '600'
            }}
          >
            {post.is_published ? 'Published' : 'Draft'}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link 
            to={`/edit/${post.id}`}
            className="btn btn-primary"
            style={{ padding: '8px 16px', fontSize: '14px' }}
          >
            <Edit3 size={14} />
            Edit
          </Link>
          
          <Link 
            to={`/post/${post.id}/analytics`}
            className="btn btn-secondary"
            style={{ padding: '8px 16px', fontSize: '14px' }}
          >
            <BarChart3 size={14} />
            Analytics
          </Link>

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="btn btn-ghost"
              style={{ padding: '8px' }}
            >
              <MoreHorizontal size={16} />
            </button>

            {showMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                background: 'var(--white)',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                padding: '8px',
                minWidth: '150px',
                zIndex: 10
              }}>
                <button 
                  className="btn btn-ghost"
                  style={{ 
                    width: '100%', 
                    justifyContent: 'flex-start',
                    padding: '8px 12px',
                    fontSize: '14px'
                  }}
                >
                  <Settings size={14} />
                  Settings
                </button>
                <button 
                  className="btn btn-ghost"
                  style={{ 
                    width: '100%', 
                    justifyContent: 'flex-start',
                    padding: '8px 12px',
                    fontSize: '14px',
                    color: '#ef4444'
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div style={{ 
        marginTop: '16px',
        padding: '16px',
        background: 'var(--white)',
        borderRadius: '8px'
      }}>
        <h4 style={{ 
          fontSize: '14px', 
          fontWeight: '600',
          marginBottom: '12px',
          color: 'var(--black)'
        }}>
          Performance insights
        </h4>
        
        <div className="grid grid-3 gap-4" style={{ fontSize: '12px' }}>
          <div>
            <div style={{ color: 'var(--gray-500)', marginBottom: '4px' }}>
              Avg. read time
            </div>
            <div style={{ fontWeight: '600', color: 'var(--black)' }}>
              {post.read_time} min
            </div>
          </div>
          <div>
            <div style={{ color: 'var(--gray-500)', marginBottom: '4px' }}>
              Engagement rate
            </div>
            <div style={{ fontWeight: '600', color: '#059669' }}>
              {((stats.likes + stats.comments) / stats.views * 100).toFixed(1)}%
            </div>
          </div>
          <div>
            <div style={{ color: 'var(--gray-500)', marginBottom: '4px' }}>
              Views today
            </div>
            <div style={{ fontWeight: '600', color: 'var(--black)' }}>
              +{Math.floor(stats.views * 0.1)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthorPostView