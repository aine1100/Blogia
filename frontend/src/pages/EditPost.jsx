import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Save, Eye, ArrowLeft, Settings, Image, Link as LinkIcon, Trash2 } from 'lucide-react'

function EditPost() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    content: '',
    category: 'Development',
    is_published: false
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const categories = ['Development', 'Design', 'Backend', 'Frontend', 'UX', 'Leadership', 'Technology']

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Mock data - replace with actual API call
      setFormData({
        title: "Building Modern Web Applications with FastAPI and React",
        subtitle: "A comprehensive guide to creating scalable applications with the latest technologies and best practices",
        content: `Building modern web applications requires the right combination of technologies, architecture decisions, and best practices. In this comprehensive guide, we'll explore how to create scalable, performant applications using FastAPI for the backend and React for the frontend.

**Why FastAPI?**

FastAPI has emerged as one of the most popular Python web frameworks for building APIs. Here's why it's become the go-to choice for many developers:

• **Performance**: FastAPI is one of the fastest Python frameworks available, rivaling Node.js and Go in speed
• **Type Safety**: Built-in support for Python type hints means fewer bugs and better IDE support  
• **Automatic Documentation**: Interactive API docs with Swagger UI generated automatically
• **Modern Python**: Leverages the latest Python features like async/await

**Setting up the Backend**

Let's start by creating a new FastAPI project. First, install the required dependencies:

\`\`\`bash
pip install fastapi uvicorn sqlalchemy psycopg2-binary
\`\`\`

Then create your main application file:

\`\`\`python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Blog API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello World"}
\`\`\`

This is just the beginning of building a comprehensive web application. The key is to follow best practices and maintain clean, well-documented code throughout the development process.`,
        category: 'Development',
        is_published: true
      })
      
      setLoading(false)
    } catch (err) {
      setError('Failed to fetch post')
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      // TODO: Implement actual update post API call
      console.log('Update post:', formData)
      await new Promise(resolve => setTimeout(resolve, 1000))
      navigate('/dashboard')
    } catch (err) {
      setError('Failed to update post. Please try again.')
      setSaving(false)
    }
  }

  const handleSaveDraft = async () => {
    setSaving(true)
    try {
      // TODO: Save as draft
      console.log('Save draft:', { ...formData, is_published: false })
      await new Promise(resolve => setTimeout(resolve, 800))
      navigate('/dashboard')
    } catch (err) {
      setError('Failed to save draft.')
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setSaving(true)
    try {
      // TODO: Delete post API call
      console.log('Delete post:', id)
      await new Promise(resolve => setTimeout(resolve, 800))
      navigate('/dashboard')
    } catch (err) {
      setError('Failed to delete post.')
      setSaving(false)
    }
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
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
              style={{ 
                background: 'none',
                border: 'none',
                color: 'var(--gray-600)',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'color 0.15s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--black)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--gray-600)'}
            >
              <ArrowLeft size={16} />
              Back to dashboard
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setPreview(!preview)}
                className="btn btn-ghost"
              >
                <Eye size={16} />
                {preview ? 'Edit' : 'Preview'}
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="btn btn-ghost"
              >
                <Settings size={16} />
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="btn btn-ghost"
                style={{ color: '#ef4444' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {error && (
            <div className="error mb-6">{error}</div>
          )}

          <div style={{ display: 'flex', gap: '32px' }}>
            {/* Editor */}
            <div style={{ flex: preview ? '1' : '2' }}>
              {!preview ? (
                <form onSubmit={handleSubmit}>
                  {/* Title */}
                  <div style={{ marginBottom: '24px' }}>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Post title"
                      style={{
                        width: '100%',
                        border: 'none',
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        fontWeight: '700',
                        lineHeight: '1.1',
                        padding: '0',
                        background: 'transparent',
                        color: 'var(--black)',
                        outline: 'none'
                      }}
                      required
                    />
                  </div>

                  {/* Subtitle */}
                  <div style={{ marginBottom: '32px' }}>
                    <input
                      type="text"
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleChange}
                      placeholder="Add a subtitle (optional)"
                      style={{
                        width: '100%',
                        border: 'none',
                        fontSize: '20px',
                        fontWeight: '400',
                        lineHeight: '1.5',
                        padding: '0',
                        background: 'transparent',
                        color: 'var(--gray-600)',
                        outline: 'none'
                      }}
                    />
                  </div>

                  {/* Toolbar */}
                  <div className="flex items-center gap-2 mb-6" style={{ 
                    padding: '12px 0',
                    borderTop: '1px solid var(--gray-100)',
                    borderBottom: '1px solid var(--gray-100)'
                  }}>
                    <button type="button" className="btn btn-ghost" style={{ padding: '8px' }}>
                      <Image size={16} />
                    </button>
                    <button type="button" className="btn btn-ghost" style={{ padding: '8px' }}>
                      <LinkIcon size={16} />
                    </button>
                  </div>

                  {/* Content */}
                  <div style={{ marginBottom: '32px' }}>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      placeholder="Tell your story..."
                      style={{
                        width: '100%',
                        minHeight: '400px',
                        border: 'none',
                        fontSize: '18px',
                        lineHeight: '1.8',
                        padding: '0',
                        background: 'transparent',
                        color: 'var(--black)',
                        outline: 'none',
                        resize: 'vertical',
                        fontFamily: 'inherit'
                      }}
                      required
                    />
                  </div>

                  {/* Settings Panel */}
                  {showSettings && (
                    <div style={{ 
                      background: 'var(--gray-50)', 
                      padding: '24px', 
                      borderRadius: '12px',
                      marginBottom: '24px'
                    }}>
                      <h3 style={{ 
                        fontSize: '18px', 
                        fontWeight: '600',
                        marginBottom: '16px',
                        color: 'var(--black)'
                      }}>
                        Post settings
                      </h3>
                      
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ 
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: 'var(--black)',
                          marginBottom: '8px'
                        }}>
                          Category
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="input"
                          style={{ maxWidth: '200px' }}
                        >
                          {categories.map(category => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="is_published"
                          name="is_published"
                          checked={formData.is_published}
                          onChange={handleChange}
                          style={{
                            width: '16px',
                            height: '16px'
                          }}
                        />
                        <label htmlFor="is_published" style={{ 
                          fontSize: '14px',
                          fontWeight: '500',
                          color: 'var(--black)'
                        }}>
                          Published
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="btn btn-primary"
                      style={{ padding: '12px 24px' }}
                    >
                      {saving ? (
                        <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                      ) : (
                        <>
                          <Save size={16} />
                          Update post
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      disabled={saving}
                      className="btn btn-secondary"
                      style={{ padding: '12px 24px' }}
                    >
                      Save as draft
                    </button>
                  </div>
                </form>
              ) : (
                /* Preview Mode */
                <div>
                  <div style={{ 
                    background: 'var(--gray-50)', 
                    padding: '16px', 
                    borderRadius: '8px',
                    marginBottom: '24px',
                    textAlign: 'center'
                  }}>
                    <p style={{ fontSize: '14px', color: 'var(--gray-600)' }}>
                      Preview mode - This is how your post will look
                    </p>
                  </div>

                  <article>
                    <h1 style={{ 
                      fontSize: 'clamp(2rem, 4vw, 3rem)', 
                      fontWeight: '700',
                      lineHeight: '1.1',
                      marginBottom: '16px',
                      color: 'var(--black)'
                    }}>
                      {formData.title || 'Post title'}
                    </h1>

                    {formData.subtitle && (
                      <p style={{
                        fontSize: '20px',
                        lineHeight: '1.5',
                        color: 'var(--gray-600)',
                        marginBottom: '32px'
                      }}>
                        {formData.subtitle}
                      </p>
                    )}

                    <div style={{ 
                      fontSize: '18px',
                      lineHeight: '1.8',
                      color: 'var(--black)',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {formData.content || 'Your story will appear here...'}
                    </div>
                  </article>
                </div>
              )}
            </div>

            {/* Sidebar */}
            {!preview && (
              <div style={{ width: '250px', flexShrink: 0 }}>
                <div style={{ 
                  background: 'var(--gray-50)', 
                  padding: '20px', 
                  borderRadius: '12px',
                  position: 'sticky',
                  top: '100px'
                }}>
                  <h3 style={{ 
                    fontSize: '16px', 
                    fontWeight: '600',
                    marginBottom: '16px',
                    color: 'var(--black)'
                  }}>
                    Post status
                  </h3>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <span 
                      className="badge"
                      style={{
                        background: formData.is_published ? 'var(--gray-100)' : '#fef3c7',
                        color: formData.is_published ? 'var(--gray-600)' : '#92400e',
                        fontSize: '12px',
                        padding: '4px 8px'
                      }}
                    >
                      {formData.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  <div style={{ fontSize: '14px', color: 'var(--gray-600)', lineHeight: '1.6' }}>
                    <p style={{ marginBottom: '8px' }}>
                      Last updated: Just now
                    </p>
                    <p>
                      Category: {formData.category}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Delete Modal */}
          {showDeleteModal && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div style={{
                background: 'var(--white)',
                padding: '32px',
                borderRadius: '12px',
                maxWidth: '400px',
                width: '90%'
              }}>
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: '600',
                  marginBottom: '16px',
                  color: 'var(--black)'
                }}>
                  Delete post
                </h3>
                <p style={{ 
                  color: 'var(--gray-600)', 
                  marginBottom: '24px',
                  lineHeight: '1.6'
                }}>
                  Are you sure you want to delete this post? This action cannot be undone.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDelete}
                    disabled={saving}
                    className="btn"
                    style={{ 
                      background: '#ef4444',
                      color: 'white',
                      padding: '12px 24px'
                    }}
                  >
                    {saving ? (
                      <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                    ) : (
                      'Delete post'
                    )}
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="btn btn-secondary"
                    style={{ padding: '12px 24px' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EditPost