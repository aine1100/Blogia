import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Clock, Search } from 'lucide-react'

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
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setPosts([
        {
          id: 1,
          title: "Building modern web applications",
          summary: "A comprehensive guide to creating scalable applications with the latest technologies and best practices.",
          created_at: "2024-01-15T10:30:00Z",
          author: { full_name: "John Doe" },
          read_time: 8,
          category: "Development"
        },
        {
          id: 2,
          title: "The art of minimal design",
          summary: "Exploring principles of minimalist design and how to apply them effectively in digital products.",
          created_at: "2024-01-14T15:45:00Z",
          author: { full_name: "Jane Smith" },
          read_time: 6,
          category: "Design"
        },
        {
          id: 3,
          title: "API design best practices",
          summary: "Essential guidelines for designing robust, scalable APIs that stand the test of time.",
          created_at: "2024-01-13T09:15:00Z",
          author: { full_name: "Alex Chen" },
          read_time: 12,
          category: "Backend"
        },
        {
          id: 4,
          title: "Understanding user experience",
          summary: "How to leverage research and data to make informed design decisions that users love.",
          created_at: "2024-01-12T14:20:00Z",
          author: { full_name: "Sarah Wilson" },
          read_time: 9,
          category: "UX"
        },
        {
          id: 5,
          title: "Frontend development trends 2024",
          summary: "Exploring the latest trends and technologies shaping the future of frontend development.",
          created_at: "2024-01-11T11:30:00Z",
          author: { full_name: "Mike Chen" },
          read_time: 7,
          category: "Frontend"
        },
        {
          id: 6,
          title: "Leading engineering teams",
          summary: "Insights on building and scaling high-performing engineering teams in modern organizations.",
          created_at: "2024-01-10T16:45:00Z",
          author: { full_name: "David Kim" },
          read_time: 11,
          category: "Leadership"
        }
      ])
      setLoading(false)
    } catch (err) {
      setError('Failed to fetch posts')
      setLoading(false)
      console.log(err)
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
                    {post.author.full_name.charAt(0)}
                  </div>
                  <div className="flex items-center gap-2" style={{ fontSize: '14px', color: 'var(--gray-600)' }}>
                    <span style={{ fontWeight: '500' }}>{post.author.full_name}</span>
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
                      {post.category}
                    </span>
                    <div className="flex items-center gap-1" style={{ color: 'var(--gray-500)', fontSize: '13px' }}>
                      <Clock size={12} />
                      <span>{post.read_time} min read</span>
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