import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Send, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import apiService from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function EditPost() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    is_published: false
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchPost();
  }, [fetchPost, id]);

  const fetchPost = async () => {
    try {
      setFetchLoading(true);
      const post = await apiService.getPost(id);
      setFormData({
        title: post.title || '',
        content: post.content || '',
        summary: post.summary || '',
        is_published: post.is_published || false
      });
    } catch (err) {
      const errorMessage = 'Failed to load post';
      setError(errorMessage);
      toast.error(errorMessage);
      console.log(err)
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e, publish = null) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const postData = {
        ...formData,
        is_published: publish !== null ? publish : formData.is_published
      };

      await apiService.updatePost(id, postData);
      
      if (publish) {
        const successMessage = 'Post published successfully!';
        setSuccess(successMessage);
        toast.success(successMessage);
        setTimeout(() => {
          navigate(`/post/${id}`);
        }, 1500);
      } else if (publish === false) {
        const successMessage = 'Post unpublished and saved as draft!';
        setSuccess(successMessage);
        toast.success(successMessage);
      } else {
        const successMessage = 'Post updated successfully!';
        setSuccess(successMessage);
        toast.success(successMessage);
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to update post';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await apiService.deletePost(id);
      toast.success('Post deleted successfully!');
      navigate('/dashboard/posts');
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete post';
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const handleSaveDraft = (e) => handleSubmit(e, false);
  const handlePublish = (e) => handleSubmit(e, true);
  const handleUpdate = (e) => handleSubmit(e, null);

  if (fetchLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh'
      }}>
        <div className="spinner" style={{ width: '32px', height: '32px' }}></div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mb-8">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="btn btn-ghost"
              style={{ 
                outline: 'none',
                color: 'var(--red)',
                borderColor: 'var(--red)'
              }}
            >
              <Trash2 size={16} />
              Delete
            </button>

            {formData.is_published ? (
              <button
                onClick={handleSaveDraft}
                disabled={loading}
                className="btn btn-secondary"
                style={{ outline: 'none' }}
              >
                {loading ? (
                  <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                ) : (
                  <>
                    <Save size={16} />
                    Unpublish
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handlePublish}
                disabled={loading || !formData.title.trim() || !formData.content.trim()}
                className="btn btn-primary"
                style={{ outline: 'none' }}
              >
                {loading ? (
                  <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                ) : (
                  <>
                    <Send size={16} />
                    Publish
                  </>
                )}
              </button>
            )}
            
            <button
              onClick={handleUpdate}
              disabled={loading || !formData.title.trim()}
              className="btn btn-primary"
              style={{ outline: 'none' }}
            >
              {loading ? (
                <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
              ) : (
                <>
                  <Save size={16} />
                  Update
                </>
              )}
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div className="error mb-6">{error}</div>
          )}

          {success && (
            <div className="success mb-6">{success}</div>
          )}

          {/* Form */}
          <div style={{
            background: 'var(--white)',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid var(--gray-100)',
            overflow: 'hidden'
          }}>
            <form onSubmit={handleUpdate}>
              {/* Title */}
              <div style={{ padding: '32px 32px 0 32px' }}>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter your post title..."
                  required
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: 'var(--black)',
                    background: 'transparent',
                    padding: '0',
                    marginBottom: '16px',
                    fontFamily: 'inherit',
                    lineHeight: '1.2'
                  }}
                />
                
                {/* Summary */}
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  placeholder="Write a brief summary of your post (optional)..."
                  rows="2"
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    fontSize: '16px',
                    color: 'var(--gray-600)',
                    background: 'transparent',
                    padding: '0',
                    marginBottom: '24px',
                    fontFamily: 'inherit',
                    lineHeight: '1.5',
                    resize: 'vertical',
                    minHeight: '60px'
                  }}
                />
              </div>

              {/* Divider */}
              <div style={{ 
                height: '1px', 
                background: 'var(--gray-100)', 
                margin: '0 32px' 
              }}></div>

              {/* Content */}
              <div style={{ padding: '32px' }}>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Start writing your post content here..."
                  required
                  rows="20"
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    fontSize: '16px',
                    color: 'var(--black)',
                    background: 'transparent',
                    padding: '0',
                    fontFamily: 'inherit',
                    lineHeight: '1.6',
                    resize: 'vertical',
                    minHeight: '400px'
                  }}
                />
              </div>

              {/* Footer */}
              <div style={{
                padding: '24px 32px',
                background: 'var(--gray-50)',
                borderTop: '1px solid var(--gray-100)'
              }}>
                <div className="flex items-center justify-between">
                  <div style={{ fontSize: '14px', color: 'var(--gray-600)' }}>
                    Editing as <strong>{user?.full_name || user?.username}</strong>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div style={{ fontSize: '14px', color: 'var(--gray-500)' }}>
                      {formData.content.length} characters
                    </div>
                    
                    <div style={{ fontSize: '14px', color: 'var(--gray-500)' }}>
                      Status: <strong style={{ color: formData.is_published ? 'var(--green)' : 'var(--orange)' }}>
                        {formData.is_published ? 'Published' : 'Draft'}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
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
                borderRadius: '12px',
                padding: '24px',
                maxWidth: '400px',
                width: '90%',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'var(--black)',
                  marginBottom: '12px'
                }}>
                  Delete Post
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: 'var(--gray-600)',
                  marginBottom: '20px'
                }}>
                  Are you sure you want to delete this post? This action cannot be undone.
                </p>
                <div className="flex items-center gap-3 justify-end">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="btn btn-secondary"
                    style={{ outline: 'none' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="btn"
                    style={{
                      outline: 'none',
                      background: 'var(--red)',
                      color: 'white',
                      borderColor: 'var(--red)'
                    }}
                  >
                    {loading ? (
                      <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                    ) : (
                      'Delete'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditPost;