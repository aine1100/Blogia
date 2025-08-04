import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Save, User, Mail, Bell, Shield, Palette, Globe } from 'lucide-react'

function DashboardSettings() {
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const [profileData, setProfileData] = useState({
    full_name: 'Dushimire Aine',
    username: 'dushimire_aine',
    email: 'dushimire.aine@example.com',
    bio: 'Senior Software Engineer with 8+ years of experience building scalable web applications. Passionate about clean code and modern development practices.',
    website: 'https://dushimire.dev',
    twitter: '@dushimire_aine',
    linkedin: 'dushimire-aine'
  })

  const [notificationSettings, setNotificationSettings] = useState({
    email_comments: true,
    email_likes: false,
    email_subscribers: true,
    email_newsletter: true,
    push_comments: true,
    push_likes: false
  })

  const [blogSettings, setBlogSettings] = useState({
    blog_title: 'BlogApp',
    blog_description: 'Stories worth reading',
    allow_comments: true,
    moderate_comments: true,
    show_subscriber_count: true,
    custom_domain: '',
    analytics_enabled: true
  })

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    })
  }

  const handleNotificationChange = (e) => {
    setNotificationSettings({
      ...notificationSettings,
      [e.target.name]: e.target.checked
    })
  }

  const handleBlogChange = (e) => {
    const { name, value, type, checked } = e.target
    setBlogSettings({
      ...blogSettings,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSave = async (section) => {
    setLoading(true)
    setSuccess('')

    try {
      // TODO: Implement actual save API call
      console.log(`Saving ${section}:`, 
        section === 'profile' ? profileData : 
        section === 'notifications' ? notificationSettings : 
        blogSettings
      )
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccess(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully!`)
      setLoading(false)
      
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setLoading(false)
    }
  }

  const tabs = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'blog', label: 'Blog Settings', icon: Globe },
    { key: 'security', label: 'Security', icon: Shield }
  ]

  return (
    <div className="py-8">
      <div className="container">
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
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
              Settings
            </h1>
          </div>

          {success && (
            <div className="success mb-6">{success}</div>
          )}

          <div className="flex gap-8">
            {/* Sidebar */}
            <div style={{ width: '250px', flexShrink: 0 }}>
              <div style={{ 
                background: 'var(--white)', 
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden'
              }}>
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      style={{
                        width: '100%',
                        padding: '16px 20px',
                        border: 'none',
                        background: activeTab === tab.key ? 'var(--gray-50)' : 'transparent',
                        color: activeTab === tab.key ? 'var(--black)' : 'var(--gray-600)',
                        fontSize: '14px',
                        fontWeight: '500',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        borderLeft: activeTab === tab.key ? '3px solid var(--black)' : '3px solid transparent'
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={16} />
                        {tab.label}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1 }}>
              <div style={{ 
                background: 'var(--white)', 
                padding: '32px', 
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                {/* Profile Settings */}
                {activeTab === 'profile' && (
                  <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
                      Profile Settings
                    </h2>

                    <div style={{ display: 'grid', gap: '24px' }}>
                      <div className="grid grid-2 gap-4">
                        <div>
                          <label style={{ 
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: 'var(--black)',
                            marginBottom: '8px'
                          }}>
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="full_name"
                            value={profileData.full_name}
                            onChange={handleProfileChange}
                            className="input"
                          />
                        </div>

                        <div>
                          <label style={{ 
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: 'var(--black)',
                            marginBottom: '8px'
                          }}>
                            Username
                          </label>
                          <input
                            type="text"
                            name="username"
                            value={profileData.username}
                            onChange={handleProfileChange}
                            className="input"
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ 
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: 'var(--black)',
                          marginBottom: '8px'
                        }}>
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          className="input"
                        />
                      </div>

                      <div>
                        <label style={{ 
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: 'var(--black)',
                          marginBottom: '8px'
                        }}>
                          Bio
                        </label>
                        <textarea
                          name="bio"
                          value={profileData.bio}
                          onChange={handleProfileChange}
                          className="textarea"
                          rows="4"
                          placeholder="Tell readers about yourself..."
                        />
                      </div>

                      <div className="grid grid-2 gap-4">
                        <div>
                          <label style={{ 
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: 'var(--black)',
                            marginBottom: '8px'
                          }}>
                            Website
                          </label>
                          <input
                            type="url"
                            name="website"
                            value={profileData.website}
                            onChange={handleProfileChange}
                            className="input"
                            placeholder="https://yourwebsite.com"
                          />
                        </div>

                        <div>
                          <label style={{ 
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: 'var(--black)',
                            marginBottom: '8px'
                          }}>
                            Twitter
                          </label>
                          <input
                            type="text"
                            name="twitter"
                            value={profileData.twitter}
                            onChange={handleProfileChange}
                            className="input"
                            placeholder="@username"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => handleSave('profile')}
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ width: 'fit-content' }}
                      >
                        {loading ? (
                          <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                        ) : (
                          <>
                            <Save size={16} />
                            Save Profile
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Notification Settings */}
                {activeTab === 'notifications' && (
                  <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
                      Notification Settings
                    </h2>

                    <div style={{ display: 'grid', gap: '32px' }}>
                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                          Email Notifications
                        </h3>
                        <div style={{ display: 'grid', gap: '16px' }}>
                          {[
                            { key: 'email_comments', label: 'New comments on your posts' },
                            { key: 'email_likes', label: 'When someone likes your post' },
                            { key: 'email_subscribers', label: 'New subscribers' },
                            { key: 'email_newsletter', label: 'Weekly newsletter summary' }
                          ].map(item => (
                            <div key={item.key} className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                id={item.key}
                                name={item.key}
                                checked={notificationSettings[item.key]}
                                onChange={handleNotificationChange}
                                style={{ width: '16px', height: '16px' }}
                              />
                              <label htmlFor={item.key} style={{ fontSize: '14px', color: 'var(--black)' }}>
                                {item.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                          Push Notifications
                        </h3>
                        <div style={{ display: 'grid', gap: '16px' }}>
                          {[
                            { key: 'push_comments', label: 'New comments' },
                            { key: 'push_likes', label: 'New likes' }
                          ].map(item => (
                            <div key={item.key} className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                id={item.key}
                                name={item.key}
                                checked={notificationSettings[item.key]}
                                onChange={handleNotificationChange}
                                style={{ width: '16px', height: '16px' }}
                              />
                              <label htmlFor={item.key} style={{ fontSize: '14px', color: 'var(--black)' }}>
                                {item.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => handleSave('notifications')}
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ width: 'fit-content' }}
                      >
                        {loading ? (
                          <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                        ) : (
                          <>
                            <Save size={16} />
                            Save Notifications
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Blog Settings */}
                {activeTab === 'blog' && (
                  <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
                      Blog Settings
                    </h2>

                    <div style={{ display: 'grid', gap: '24px' }}>
                      <div className="grid grid-2 gap-4">
                        <div>
                          <label style={{ 
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: 'var(--black)',
                            marginBottom: '8px'
                          }}>
                            Blog Title
                          </label>
                          <input
                            type="text"
                            name="blog_title"
                            value={blogSettings.blog_title}
                            onChange={handleBlogChange}
                            className="input"
                          />
                        </div>

                        <div>
                          <label style={{ 
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: 'var(--black)',
                            marginBottom: '8px'
                          }}>
                            Custom Domain
                          </label>
                          <input
                            type="text"
                            name="custom_domain"
                            value={blogSettings.custom_domain}
                            onChange={handleBlogChange}
                            className="input"
                            placeholder="yourblog.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ 
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: 'var(--black)',
                          marginBottom: '8px'
                        }}>
                          Blog Description
                        </label>
                        <textarea
                          name="blog_description"
                          value={blogSettings.blog_description}
                          onChange={handleBlogChange}
                          className="textarea"
                          rows="3"
                        />
                      </div>

                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                          Features
                        </h3>
                        <div style={{ display: 'grid', gap: '16px' }}>
                          {[
                            { key: 'allow_comments', label: 'Allow comments on posts' },
                            { key: 'moderate_comments', label: 'Moderate comments before publishing' },
                            { key: 'show_subscriber_count', label: 'Show subscriber count publicly' },
                            { key: 'analytics_enabled', label: 'Enable analytics tracking' }
                          ].map(item => (
                            <div key={item.key} className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                id={item.key}
                                name={item.key}
                                checked={blogSettings[item.key]}
                                onChange={handleBlogChange}
                                style={{ width: '16px', height: '16px' }}
                              />
                              <label htmlFor={item.key} style={{ fontSize: '14px', color: 'var(--black)' }}>
                                {item.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => handleSave('blog')}
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ width: 'fit-content' }}
                      >
                        {loading ? (
                          <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                        ) : (
                          <>
                            <Save size={16} />
                            Save Settings
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Security Settings */}
                {activeTab === 'security' && (
                  <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
                      Security Settings
                    </h2>

                    <div style={{ display: 'grid', gap: '32px' }}>
                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                          Change Password
                        </h3>
                        <div style={{ display: 'grid', gap: '16px', maxWidth: '400px' }}>
                          <input
                            type="password"
                            placeholder="Current password"
                            className="input"
                          />
                          <input
                            type="password"
                            placeholder="New password"
                            className="input"
                          />
                          <input
                            type="password"
                            placeholder="Confirm new password"
                            className="input"
                          />
                          <button className="btn btn-primary" style={{ width: 'fit-content' }}>
                            Update Password
                          </button>
                        </div>
                      </div>

                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                          Account Actions
                        </h3>
                        <div style={{ display: 'grid', gap: '16px' }}>
                          <button className="btn btn-secondary" style={{ width: 'fit-content' }}>
                            Download Account Data
                          </button>
                          <button 
                            className="btn" 
                            style={{ 
                              width: 'fit-content',
                              background: '#fef2f2',
                              color: '#dc2626',
                              border: '1px solid #fecaca'
                            }}
                          >
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardSettings