import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Save, User, Bell, Shield, Globe } from "lucide-react";
import apiService from "../services/api";
import { useAuth } from "../contexts/AuthContext";

function DashboardSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [fetchLoading, setFetchLoading] = useState(true);

  // Focus states for textareas
  const [bioFocused, setBioFocused] = useState(false);
  const [descFocused, setDescFocused] = useState(false);

  // Refs for auto-resize
  const bioRef = useRef(null);
  const descRef = useRef(null);

  // Max lengths
  const bioMaxLength = 500;
  const descMaxLength = 200;

  const {  updateUser } = useAuth();

  const [profileData, setProfileData] = useState({
    full_name: "",
    username: "",
    email: "",
    bio: "",
    website: "",
    twitter: "",
    linkedin: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email_comments: true,
    email_likes: false,
    email_subscribers: true,
    email_newsletter: true,
    push_comments: true,
    push_likes: false,
  });

  const [blogSettings, setBlogSettings] = useState({
    blog_title: "My Blog",
    blog_description: "Welcome to my blog",
    allow_comments: true,
    moderate_comments: false,
    show_subscriber_count: true,
    custom_domain: "",
    analytics_enabled: true,
  });

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });

    // Auto-resize for bio textarea
    if (e.target.name === "bio") {
      adjustHeight(bioRef);
    }
  };

  const handleNotificationChange = (e) => {
    setNotificationSettings({
      ...notificationSettings,
      [e.target.name]: e.target.checked,
    });
  };

  const handleBlogChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBlogSettings({
      ...blogSettings,
      [name]: type === "checkbox" ? checked : value,
    });

    // Auto-resize for description textarea
    if (name === "blog_description") {
      adjustHeight(descRef);
    }
  };

  // Auto-resize function
  const adjustHeight = (ref) => {
    const textarea = ref.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(Math.max(textarea.scrollHeight, 100), 200);
      textarea.style.height = `${newHeight}px`;
    }
  };

  // Auto-resize on mount
  useEffect(() => {
    adjustHeight(bioRef);
    adjustHeight(descRef);
  }, [profileData.bio, blogSettings.blog_description]);

  // Fetch user data and settings on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setFetchLoading(true);
      setError('');

      // Fetch user profile and settings in parallel
      const [userProfile, userSettings] = await Promise.all([
        apiService.getCurrentUser(),
        apiService.getUserSettings().catch(() => null) // Settings might not exist yet
      ]);

      // Update profile data
      setProfileData({
        full_name: userProfile.full_name || '',
        username: userProfile.username || '',
        email: userProfile.email || '',
        bio: userProfile.bio || '',
        website: userProfile.website || '',
        twitter: userProfile.twitter || '',
        linkedin: userProfile.linkedin || '',
      });

      // Update notification settings
      if (userSettings) {
        setNotificationSettings({
          email_comments: userSettings.comment_notifications ?? true,
          email_likes: userSettings.like_notifications ?? false,
          email_subscribers: userSettings.email_notifications ?? true,
          email_newsletter: userSettings.newsletter_subscription ?? true,
          push_comments: userSettings.comment_notifications ?? true,
          push_likes: userSettings.like_notifications ?? false,
        });

        // Update blog settings
        setBlogSettings({
          blog_title: userSettings.blog_title || 'My Blog',
          blog_description: userSettings.blog_description || 'Welcome to my blog',
          allow_comments: userSettings.allow_comments ?? true,
          moderate_comments: userSettings.moderate_comments ?? false,
          show_subscriber_count: true, // This might be a separate setting
          custom_domain: '', // This might be a separate setting
          analytics_enabled: true, // This might be a separate setting
        });
      }

    } catch (err) {
      console.error('Failed to fetch user data:', err);
      setError('Failed to load settings. Please try again.');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSave = async (section) => {
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      if (section === "profile") {
        // Update user profile
        const updatedUser = await apiService.updateProfile(profileData);
        updateUser(updatedUser); // Update auth context
        setSuccess("Profile updated successfully!");
      } else if (section === "notifications" || section === "blog") {
        // Combine notification and blog settings for the user settings API
        const settingsData = {
          // Notification settings
          email_notifications: notificationSettings.email_subscribers,
          comment_notifications: notificationSettings.email_comments,
          like_notifications: notificationSettings.email_likes,
          newsletter_subscription: notificationSettings.email_newsletter,
          
          // Blog settings
          blog_title: blogSettings.blog_title,
          blog_description: blogSettings.blog_description,
          allow_comments: blogSettings.allow_comments,
          moderate_comments: blogSettings.moderate_comments,
        };

        await apiService.updateUserSettings(settingsData);
        setSuccess(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully!`);
      }

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(`Failed to save ${section}:`, err);
      setError(err.message || `Failed to save ${section} settings. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: "profile", label: "Profile", icon: User },
    { key: "notifications", label: "Notifications", icon: Bell },
    { key: "blog", label: "Blog Settings", icon: Globe },
    { key: "security", label: "Security", icon: Shield },
  ];

  // Password Change Component
  const PasswordChangeForm = () => {
    const [passwordData, setPasswordData] = useState({
      current_password: '',
      new_password: '',
      confirm_password: ''
    });
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    const handlePasswordChange = (e) => {
      setPasswordData({
        ...passwordData,
        [e.target.name]: e.target.value
      });
    };

    const handlePasswordSubmit = async (e) => {
      e.preventDefault();
      setPasswordLoading(true);
      setPasswordError('');
      setPasswordSuccess('');

      if (passwordData.new_password !== passwordData.confirm_password) {
        setPasswordError('New passwords do not match');
        setPasswordLoading(false);
        return;
      }

      try {
        await apiService.changePassword({
          current_password: passwordData.current_password,
          new_password: passwordData.new_password
        });

        setPasswordSuccess('Password updated successfully!');
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });

        setTimeout(() => setPasswordSuccess(''), 3000);
      } catch (err) {
        setPasswordError(err.message || 'Failed to update password');
      } finally {
        setPasswordLoading(false);
      }
    };

    return (
      <form onSubmit={handlePasswordSubmit}>
        <div style={{ display: "grid", gap: "16px", maxWidth: "400px" }}>
          {passwordError && (
            <div className="error" style={{ fontSize: '14px' }}>{passwordError}</div>
          )}
          {passwordSuccess && (
            <div className="success" style={{ fontSize: '14px' }}>{passwordSuccess}</div>
          )}
          
          <input
            type="password"
            name="current_password"
            value={passwordData.current_password}
            onChange={handlePasswordChange}
            placeholder="Current password"
            className="input"
            required
            style={{ outline: "none" }}
          />
          <input
            type="password"
            name="new_password"
            value={passwordData.new_password}
            onChange={handlePasswordChange}
            placeholder="New password"
            className="input"
            required
            minLength="6"
            style={{ outline: "none" }}
          />
          <input
            type="password"
            name="confirm_password"
            value={passwordData.confirm_password}
            onChange={handlePasswordChange}
            placeholder="Confirm new password"
            className="input"
            required
            style={{ outline: "none" }}
          />
          <button
            type="submit"
            disabled={passwordLoading}
            className="btn btn-primary"
            style={{ width: "fit-content", outline: "none" }}
          >
            {passwordLoading ? (
              <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
            ) : (
              'Update Password'
            )}
          </button>
        </div>
      </form>
    );
  };

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
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              to="/dashboard"
              className="flex items-center gap-2"
              style={{
                color: "var(--gray-600)",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "500",
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.target.style.color = "var(--black)")}
              onMouseLeave={(e) => (e.target.style.color = "var(--gray-600)")}
            >
              <ArrowLeft size={24} />
            </Link>

            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: "700",
                color: "var(--black)",
              }}
            >
              Settings
            </h1>
          </div>

          {success && <div className="success mb-6">{success}</div>}
          {error && <div className="error mb-6">{error}</div>}

          <div className="flex gap-8">
            {/* Sidebar */}
            <div style={{ width: "250px", flexShrink: 0 }}>
              <div
                style={{
                  background: "var(--white)",
                  borderRadius: "12px",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                }}
              >
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      style={{
                        width: "100%",
                        padding: "16px 20px",
                        border: "none",
                        background:
                          activeTab === tab.key
                            ? "var(--gray-50)"
                            : "transparent",
                        color:
                          activeTab === tab.key
                            ? "var(--black)"
                            : "var(--gray-600)",
                        fontSize: "14px",
                        fontWeight: "500",
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                        borderLeft:
                          activeTab === tab.key
                            ? "3px solid var(--black)"
                            : "3px solid transparent",
                        outline: "none",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={16} />
                        {tab.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  background: "var(--white)",
                  padding: "32px",
                  borderRadius: "12px",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                }}
              >
                {/* Profile Settings */}
                {activeTab === "profile" && (
                  <div>
                    <h2
                      style={{
                        fontSize: "24px",
                        fontWeight: "600",
                        marginBottom: "24px",
                      }}
                    >
                      Profile Settings
                    </h2>

                    <div style={{ display: "grid", gap: "24px" }}>
                      <div className="grid grid-2 gap-4">
                        <div>
                          <label
                            style={{
                              display: "block",
                              fontSize: "14px",
                              fontWeight: "500",
                              color: "var(--black)",
                              marginBottom: "8px",
                            }}
                          >
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="full_name"
                            value={profileData.full_name}
                            onChange={handleProfileChange}
                            className="input"
                            style={{ outline: "none" }}
                          />
                        </div>

                        <div>
                          <label
                            style={{
                              display: "block",
                              fontSize: "14px",
                              fontWeight: "500",
                              color: "var(--black)",
                              marginBottom: "8px",
                            }}
                          >
                            Username
                          </label>
                          <input
                            type="text"
                            name="username"
                            value={profileData.username}
                            onChange={handleProfileChange}
                            className="input"
                            style={{ outline: "none" }}
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "var(--black)",
                            marginBottom: "8px",
                          }}
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          className="input"
                          style={{ outline: "none" }}
                        />
                      </div>

                      <div
                        style={{ position: "relative", marginBottom: "20px" }}
                      >
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "var(--black)",
                            marginBottom: "8px",
                          }}
                        >
                          Bio
                        </label>

                        {/* Modern Textarea Container */}
                        <div
                          style={{
                            position: "relative",
                            borderRadius: "12px",
                            background:
                              "linear-gradient(145deg, var(--white), var(--gray-50))",
                            padding: "2px",
                            boxShadow: bioFocused
                              ? "0 0 0 4px rgba(0, 0, 0, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                              : "0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.06)",
                            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                            border: bioFocused
                              ? "2px solid var(--black)"
                              : "2px solid var(--gray-200)",
                          }}
                        >
                          <textarea
                            ref={bioRef}
                            name="bio"
                            value={profileData.bio}
                            onChange={handleProfileChange}
                            onFocus={() => setBioFocused(true)}
                            onBlur={() => setBioFocused(false)}
                            onInput={() => adjustHeight(bioRef)}
                            maxLength={bioMaxLength}
                            rows="4"
                            placeholder="Tell readers about yourself... Share your interests, experience, or what makes you unique."
                            style={{
                              width: "100%",
                              border: "none",
                              outline: "none",
                              resize: "none",
                              minHeight: "100px",
                              maxHeight: "200px",
                              fontFamily: "inherit",
                              fontSize: "15px",
                              lineHeight: "1.6",
                              padding: "16px 18px",
                              backgroundColor: "transparent",
                              borderRadius: "10px",
                              color: "var(--black)",
                              transition: "all 0.2s ease",
                            }}
                          />
                        </div>

                        {/* Character Counter */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: "8px",
                            fontSize: "12px",
                            color: "var(--gray-600)",
                          }}
                        >
                          <span
                            style={{
                              opacity: bioFocused ? 1 : 0.7,
                              transition: "opacity 0.2s ease",
                            }}
                          >
                            {profileData.bio.length > 0 && "Looking good! "}
                            {profileData.bio.length === 0 &&
                              "Start writing your bio..."}
                          </span>
                          <span
                            style={{
                              color:
                                profileData.bio.length > bioMaxLength * 0.9
                                  ? "var(--red)"
                                  : "var(--gray-600)",
                              fontWeight:
                                profileData.bio.length > bioMaxLength * 0.9
                                  ? "600"
                                  : "400",
                              transition: "color 0.2s ease",
                            }}
                          >
                            {profileData.bio.length}/{bioMaxLength}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div
                          style={{
                            marginTop: "6px",
                            height: "2px",
                            backgroundColor: "var(--gray-200)",
                            borderRadius: "1px",
                            overflow: "hidden",
                            opacity: bioFocused ? 1 : 0.5,
                            transition: "opacity 0.2s ease",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              backgroundColor:
                                profileData.bio.length > bioMaxLength * 0.9
                                  ? "var(--red)"
                                  : "var(--black)",
                              borderRadius: "1px",
                              transition:
                                "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                              width: `${Math.min(
                                (profileData.bio.length / bioMaxLength) * 100,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-2 gap-4">
                        <div>
                          <label
                            style={{
                              display: "block",
                              fontSize: "14px",
                              fontWeight: "500",
                              color: "var(--black)",
                              marginBottom: "8px",
                            }}
                          >
                            Website
                          </label>
                          <input
                            type="url"
                            name="website"
                            value={profileData.website}
                            onChange={handleProfileChange}
                            className="input"
                            placeholder="https://yourwebsite.com"
                            style={{ outline: "none" }}
                          />
                        </div>

                        <div>
                          <label
                            style={{
                              display: "block",
                              fontSize: "14px",
                              fontWeight: "500",
                              color: "var(--black)",
                              marginBottom: "8px",
                            }}
                          >
                            Twitter
                          </label>
                          <input
                            type="text"
                            name="twitter"
                            value={profileData.twitter}
                            onChange={handleProfileChange}
                            className="input"
                            placeholder="@username"
                            style={{ outline: "none" }}
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => handleSave("profile")}
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ width: "fit-content", outline: "none" }}
                      >
                        {loading ? (
                          <div
                            className="spinner"
                            style={{ width: "16px", height: "16px" }}
                          ></div>
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
                {activeTab === "notifications" && (
                  <div>
                    <h2
                      style={{
                        fontSize: "24px",
                        fontWeight: "600",
                        marginBottom: "24px",
                      }}
                    >
                      Notification Settings
                    </h2>

                    <div style={{ display: "grid", gap: "32px" }}>
                      <div>
                        <h3
                          style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            marginBottom: "16px",
                          }}
                        >
                          Email Notifications
                        </h3>
                        <div style={{ display: "grid", gap: "16px" }}>
                          {[
                            {
                              key: "email_comments",
                              label: "New comments on your posts",
                            },
                            {
                              key: "email_likes",
                              label: "When someone likes your post",
                            },
                            {
                              key: "email_subscribers",
                              label: "New subscribers",
                            },
                            {
                              key: "email_newsletter",
                              label: "Weekly newsletter summary",
                            },
                          ].map((item) => (
                            <div
                              key={item.key}
                              className="flex items-center gap-3"
                            >
                              <input
                                type="checkbox"
                                id={item.key}
                                name={item.key}
                                checked={notificationSettings[item.key]}
                                onChange={handleNotificationChange}
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  outline: "none",
                                }}
                              />
                              <label
                                htmlFor={item.key}
                                style={{
                                  fontSize: "14px",
                                  color: "var(--black)",
                                  cursor: "pointer",
                                }}
                              >
                                {item.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3
                          style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            marginBottom: "16px",
                          }}
                        >
                          Push Notifications
                        </h3>
                        <div style={{ display: "grid", gap: "16px" }}>
                          {[
                            { key: "push_comments", label: "New comments" },
                            { key: "push_likes", label: "New likes" },
                          ].map((item) => (
                            <div
                              key={item.key}
                              className="flex items-center gap-3"
                            >
                              <input
                                type="checkbox"
                                id={item.key}
                                name={item.key}
                                checked={notificationSettings[item.key]}
                                onChange={handleNotificationChange}
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  outline: "none",
                                }}
                              />
                              <label
                                htmlFor={item.key}
                                style={{
                                  fontSize: "14px",
                                  color: "var(--black)",
                                  cursor: "pointer",
                                }}
                              >
                                {item.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => handleSave("notifications")}
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ width: "fit-content", outline: "none" }}
                      >
                        {loading ? (
                          <div
                            className="spinner"
                            style={{ width: "16px", height: "16px" }}
                          ></div>
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
                {activeTab === "blog" && (
                  <div>
                    <h2
                      style={{
                        fontSize: "24px",
                        fontWeight: "600",
                        marginBottom: "24px",
                      }}
                    >
                      Blog Settings
                    </h2>

                    <div style={{ display: "grid", gap: "24px" }}>
                      <div className="grid grid-2 gap-4">
                        <div>
                          <label
                            style={{
                              display: "block",
                              fontSize: "14px",
                              fontWeight: "500",
                              color: "var(--black)",
                              marginBottom: "8px",
                            }}
                          >
                            Blog Title
                          </label>
                          <input
                            type="text"
                            name="blog_title"
                            value={blogSettings.blog_title}
                            onChange={handleBlogChange}
                            className="input"
                            style={{ outline: "none" }}
                          />
                        </div>

                        <div>
                          <label
                            style={{
                              display: "block",
                              fontSize: "14px",
                              fontWeight: "500",
                              color: "var(--black)",
                              marginBottom: "8px",
                            }}
                          >
                            Custom Domain
                          </label>
                          <input
                            type="text"
                            name="custom_domain"
                            value={blogSettings.custom_domain}
                            onChange={handleBlogChange}
                            className="input"
                            placeholder="yourblog.com"
                            style={{ outline: "none" }}
                          />
                        </div>
                      </div>

                      <div
                        style={{ position: "relative", marginBottom: "20px" }}
                      >
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "var(--black)",
                            marginBottom: "8px",
                          }}
                        >
                          Blog Description
                        </label>

                        {/* Modern Textarea Container */}
                        <div
                          style={{
                            position: "relative",
                            borderRadius: "12px",
                            background:
                              "linear-gradient(145deg, var(--white), var(--gray-50))",
                            padding: "2px",
                            boxShadow: descFocused
                              ? "0 0 0 4px rgba(0, 0, 0, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                              : "0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.06)",
                            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                            border: descFocused
                              ? "2px solid var(--black)"
                              : "2px solid var(--gray-200)",
                          }}
                        >
                          <textarea
                            ref={descRef}
                            name="blog_description"
                            value={blogSettings.blog_description}
                            onChange={handleBlogChange}
                            onFocus={() => setDescFocused(true)}
                            onBlur={() => setDescFocused(false)}
                            onInput={() => adjustHeight(descRef)}
                            maxLength={descMaxLength}
                            rows="3"
                            placeholder="Describe what your blog is about... Share your niche, topics, or writing style."
                            style={{
                              width: "100%",
                              border: "none",
                              outline: "none",
                              resize: "none",
                              minHeight: "80px",
                              maxHeight: "150px",
                              fontFamily: "inherit",
                              fontSize: "15px",
                              lineHeight: "1.6",
                              padding: "16px 18px",
                              backgroundColor: "transparent",
                              borderRadius: "10px",
                              color: "var(--black)",
                              transition: "all 0.2s ease",
                            }}
                          />
                        </div>

                        {/* Character Counter */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: "8px",
                            fontSize: "12px",
                            color: "var(--gray-600)",
                          }}
                        >
                          <span
                            style={{
                              opacity: descFocused ? 1 : 0.7,
                              transition: "opacity 0.2s ease",
                            }}
                          >
                            {blogSettings.blog_description.length > 0 &&
                              "Perfect! "}
                            {blogSettings.blog_description.length === 0 &&
                              "Describe your blog..."}
                          </span>
                          <span
                            style={{
                              color:
                                blogSettings.blog_description.length >
                                descMaxLength * 0.9
                                  ? "var(--red)"
                                  : "var(--gray-600)",
                              fontWeight:
                                blogSettings.blog_description.length >
                                descMaxLength * 0.9
                                  ? "600"
                                  : "400",
                              transition: "color 0.2s ease",
                            }}
                          >
                            {blogSettings.blog_description.length}/
                            {descMaxLength}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div
                          style={{
                            marginTop: "6px",
                            height: "2px",
                            backgroundColor: "var(--gray-200)",
                            borderRadius: "1px",
                            overflow: "hidden",
                            opacity: descFocused ? 1 : 0.5,
                            transition: "opacity 0.2s ease",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              backgroundColor:
                                blogSettings.blog_description.length >
                                descMaxLength * 0.9
                                  ? "var(--red)"
                                  : "var(--black)",
                              borderRadius: "1px",
                              transition:
                                "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                              width: `${Math.min(
                                (blogSettings.blog_description.length /
                                  descMaxLength) *
                                  100,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <h3
                          style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            marginBottom: "16px",
                          }}
                        >
                          Features
                        </h3>
                        <div style={{ display: "grid", gap: "16px" }}>
                          {[
                            {
                              key: "allow_comments",
                              label: "Allow comments on posts",
                            },
                            {
                              key: "moderate_comments",
                              label: "Moderate comments before publishing",
                            },
                            {
                              key: "show_subscriber_count",
                              label: "Show subscriber count publicly",
                            },
                            {
                              key: "analytics_enabled",
                              label: "Enable analytics tracking",
                            },
                          ].map((item) => (
                            <div
                              key={item.key}
                              className="flex items-center gap-3"
                            >
                              <input
                                type="checkbox"
                                id={item.key}
                                name={item.key}
                                checked={blogSettings[item.key]}
                                onChange={handleBlogChange}
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  outline: "none",
                                }}
                              />
                              <label
                                htmlFor={item.key}
                                style={{
                                  fontSize: "14px",
                                  color: "var(--black)",
                                  cursor: "pointer",
                                }}
                              >
                                {item.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => handleSave("blog")}
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ width: "fit-content", outline: "none" }}
                      >
                        {loading ? (
                          <div
                            className="spinner"
                            style={{ width: "16px", height: "16px" }}
                          ></div>
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
                {activeTab === "security" && (
                  <div>
                    <h2
                      style={{
                        fontSize: "24px",
                        fontWeight: "600",
                        marginBottom: "24px",
                      }}
                    >
                      Security Settings
                    </h2>

                    <div style={{ display: "grid", gap: "32px" }}>
                      <div>
                        <h3
                          style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            marginBottom: "16px",
                          }}
                        >
                          Change Password
                        </h3>
                        <PasswordChangeForm />
                      </div>

                      <div>
                        <h3
                          style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            marginBottom: "16px",
                          }}
                        >
                          Account Actions
                        </h3>
                        <div style={{ display: "grid", gap: "16px" }}>
                          <button
                            className="btn btn-secondary"
                            style={{ width: "fit-content", outline: "none" }}
                          >
                            Download Account Data
                          </button>
                          <button
                            className="btn"
                            style={{
                              width: "fit-content",
                              background: "#fef2f2",
                              color: "#dc2626",
                              border: "1px solid #fecaca",
                              outline: "none",
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
  );
}

export default DashboardSettings;
