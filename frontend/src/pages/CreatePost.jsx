import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, Eye, ArrowLeft, Settings, Image, Link as LinkIcon } from 'lucide-react'

function CreatePost() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    content: '',
    category: 'Development',
    is_published: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const categories = ['Development', 'Design', 'Backend', 'Frontend', 'UX', 'Leadership', 'Technology']

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // TODO: Implement actual create post API call
      console.log('Create post:', formData)
      await new Promise(resolve => setTimeout(resolve, 1000))
      navigate('/dashboard')
    } catch (err) {
      setError('Failed to create post. Please try again.')
      setLoading(false)
    }
  }

  const handleSaveDraft = async () => {
    setLoading(true)
    try {
      // TODO: Save as draft
      console.log('Save draft:', { ...formData, is_published: false })
      await new Promise(resolve => setTimeout(resolve, 800))
      navigate('/dashboard')
    } catch (err) {
      setError('Failed to save draft.')
      setLoading(false)
    }
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
                          Publish immediately
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary"
                      style={{ padding: '12px 24px' }}
                    >
                      {loading ? (
                        <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                      ) : (
                        <>
                          <Save size={16} />
                          {formData.is_published ? 'Publish' : 'Save draft'}
                        </>
                      )}
                    </button>
                    
                    {!formData.is_published && (
                      <button
                        type="button"
                        onClick={handleSaveDraft}
                        disabled={loading}
                        className="btn btn-secondary"
                        style={{ padding: '12px 24px' }}
                      >
                        Save as draft
                      </button>
                    )}
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
                    Writing tips
                  </h3>
                  
                  <ul style={{ 
                    listStyle: 'none',
                    fontSize: '14px',
                    color: 'var(--gray-600)',
                    lineHeight: '1.6'
                  }}>
                    <li style={{ marginBottom: '12px' }}>
                      • Start with a compelling headline
                    </li>
                    <li style={{ marginBottom: '12px' }}>
                      • Use short paragraphs for readability
                    </li>
                    <li style={{ marginBottom: '12px' }}>
                      • Include examples and stories
                    </li>
                    <li style={{ marginBottom: '12px' }}>
                      • End with a clear conclusion
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePost