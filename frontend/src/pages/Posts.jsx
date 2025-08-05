import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Clock, Search } from 'lucide-react'
import apiService from '../services/api'

function Posts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'Development', 'Design', 'Backend', 'UX', 'Frontend', 'Leadership']

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      setError('')

      // Fetch all published posts
      const response = await apiService.getPosts(0, 50)
      setPosts(response || [])
      setLoading(false)
    } catch (err) {
      setError('Failed to fetch posts')
      setLoading(false)
      console.error('Error fetching posts:', err)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.summary.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="error">{error}</div>
      </div>
    )
  }

  return (
    <div className="py-12" style={{ padding: '80px 0' }}>
      <div className="container" style={{ padding: '0 32px' }}>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="mb-4" style={{ fontSize: '3rem', fontWeight: '700' }}>
            All articles
          </h1>
          <p style={{ color: 'var(--gray-600)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
            Discover insights, tutorials, and stories from our community of writers
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-12" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="flex gap-4 mb-6" style={{ flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: '1', minWidth: '300px' }}>
              <Search size={16} style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: 'var(--gray-400)'
              }} />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input"
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2" style={{ flexWrap: 'wrap', justifyContent: 'center',paddingBottom:16 }}>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 'btn btn-primary' : 'btn btn-ghost'}
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <p style={{ color: 'var(--gray-600)', fontSize: '16px' }}>
              No articles found matching your criteria.
            </p>
          </div>
        ) : (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {filteredPosts.map((post, index) => (
              <article 
                key={post.id} 
                className={`animate-slide-up delay-${Math.min((index + 1) * 100, 600)}`}
                style={{ 
                  paddingBottom: '48px',
                  marginBottom: '48px',
                  borderBottom: index < filteredPosts.length - 1 ? '1px solid var(--gray-100)' : 'none'
                }}
              >
                {/* Author info */}
                <div className="flex items-center gap-3 mb-4">
                  <div style={{
                    width: '24px',
                    height: '24px',
                    background: 'var(--black)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--white)',
                    fontSize: '10px',
                    fontWeight: '600'
                  }}>
                    {post.author?.full_name?.charAt(0) || post.author?.username?.charAt(0) || "U"}
                  </div>
                  <div className="flex items-center gap-2" style={{ fontSize: '14px', color: 'var(--gray-600)' }}>
                    <span style={{ fontWeight: '500' }}>{post.author?.full_name || post.author?.username || "Unknown Author"}</span>
                    <span>•</span>
                    <span>{formatDate(post.created_at)}</span>
                  </div>
                </div>

                {/* Post content */}
                <Link 
                  to={`/post/${post.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <h2 style={{ 
                    fontSize: 'clamp(1.5rem, 3vw, 2rem)', 
                    fontWeight: '700', 
                    marginBottom: '12px',
                    lineHeight: '1.2',
                    color: 'var(--black)',
                    transition: 'color 0.15s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--gray-600)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--black)'}
                  >
                    {post.title}
                  </h2>
                  
                  <p style={{ 
                    color: 'var(--gray-600)', 
                    lineHeight: '1.6',
                    marginBottom: '16px',
                    fontSize: '16px'
                  }}>
                    {post.summary}
                  </p>
                </Link>

                {/* Post meta */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="badge" style={{ 
                      background: 'var(--gray-100)',
                      color: 'var(--gray-600)',
                      fontSize: '12px',
                      padding: '4px 8px'
                    }}>
                      {post.category || "Article"}
                    </span>
                    <div className="flex items-center gap-1" style={{ color: 'var(--gray-500)', fontSize: '13px' }}>
                      <Clock size={12} />
                      <span>{Math.ceil((post.content?.length || 0) / 200)} min read</span>
                    </div>
                  </div>

                  <Link 
                    to={`/post/${post.id}`}
                    style={{ 
                      color: 'var(--gray-500)',
                      textDecoration: 'none',
                      fontSize: '13px',
                      fontWeight: '500',
                      transition: 'color 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--black)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--gray-500)'}
                  >
                    Read more →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Load More */}
        {filteredPosts.length > 0 && (
          <div className="text-center" style={{ marginTop: '48px' }}>
            <button className="btn btn-secondary">
              Load more articles
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Posts