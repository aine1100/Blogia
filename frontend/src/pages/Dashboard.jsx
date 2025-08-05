import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  PenTool,
  BarChart3,
  Users,
  Eye,
  TrendingUp,
  Calendar,
  Plus,
  Settings,
  Bell,
} from "lucide-react";
import apiService from "../services/api";
import { useAuth } from "../contexts/AuthContext";

function Dashboard() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    totalSubscribers: 0,
  });

  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch dashboard stats and recent posts in parallel
      const [statsResponse, postsResponse] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getRecentPosts(5)
      ]);

      setStats(statsResponse);
      setRecentPosts(postsResponse.recentPosts || []);
      
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
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

  if (error) {
    return (
      <div className="py-8">
        <div className="container">
          <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: 'center' }}>
            <div className="error" style={{ marginBottom: '16px' }}>{error}</div>
            <button 
              onClick={fetchDashboardData}
              className="btn btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container">
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "700",
                  marginBottom: "8px",
                  color: "var(--black)",
                }}
              >
                Dashboard
              </h1>
              <p style={{ color: "var(--gray-600)", fontSize: "16px" }}>
                Welcome back, {user?.full_name || user?.username}! Here's what's happening with your blog.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button className="btn btn-ghost" style={{ padding: "8px",outline:'none' }}>
                <Bell size={20} />
              </button>
              <button className="btn btn-ghost" style={{ padding: "8px",outline:'none' }}>
                <Settings size={20} />
              </button>
              <Link to="/create" className="btn btn-primary">
                <Plus size={16} />
                New post
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-3 gap-6 mb-12">
            <div
              style={{
                background: "var(--white)",
                padding: "24px",
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "var(--gray-100)",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--gray-600)",
                  }}
                >
                  <PenTool size={20} />
                </div>
                <span
                  style={{
                    fontSize: "12px",
                    color: "var(--gray-500)",
                    background: "var(--gray-50)",
                    padding: "4px 8px",
                    borderRadius: "4px",
                  }}
                >
                  {stats.publishedPosts} published
                </span>
              </div>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  color: "var(--black)",
                  marginBottom: "4px",
                }}
              >
                {stats.totalPosts}
              </div>
              <p style={{ color: "var(--gray-600)", fontSize: "14px" }}>
                Total posts
              </p>
            </div>

            <div
              style={{
                background: "var(--white)",
                padding: "24px",
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "var(--gray-100)",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--gray-600)",
                  }}
                >
                  <Eye size={20} />
                </div>
                <span
                  style={{
                    fontSize: "12px",
                    color: "var(--gray-500)",
                    background: "var(--gray-50)",
                    padding: "4px 8px",
                    borderRadius: "4px",
                  }}
                >
                  {stats.totalLikes} likes
                </span>
              </div>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  color: "var(--black)",
                  marginBottom: "4px",
                }}
              >
                {stats.totalViews?.toLocaleString() || 0}
              </div>
              <p style={{ color: "var(--gray-600)", fontSize: "14px" }}>
                Total views
              </p>
            </div>

            <div
              style={{
                background: "var(--white)",
                padding: "24px",
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "var(--gray-100)",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--gray-600)",
                  }}
                >
                  <Users size={20} />
                </div>
                <span
                  style={{
                    fontSize: "12px",
                    color: "var(--gray-500)",
                    background: "var(--gray-50)",
                    padding: "4px 8px",
                    borderRadius: "4px",
                  }}
                >
                  {stats.totalComments} comments
                </span>
              </div>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  color: "var(--black)",
                  marginBottom: "4px",
                }}
              >
                {stats.totalSubscribers || 0}
              </div>
              <p style={{ color: "var(--gray-600)", fontSize: "14px" }}>
                Subscribers
              </p>
            </div>
          </div>

          <div className="grid grid-2 gap-8">
            {/* Recent Posts */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: "600",
                    color: "var(--black)",
                  }}
                >
                  Recent posts
                </h2>
                <Link
                  to="/dashboard/posts"
                  style={{
                    color: "var(--gray-600)",
                    fontSize: "14px",
                    textDecoration: "none",
                    fontWeight: "500",
                  }}
                >
                  View all →
                </Link>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {recentPosts.map((post) => (
                  <div
                    key={post.id}
                    style={{
                      background: "var(--white)",
                      padding: "20px",
                      borderRadius: "8px",
                      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div style={{ flex: 1 }}>
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className="badge"
                            style={{
                              background:
                                post.is_published
                                  ? "var(--gray-100)"
                                  : "#fef3c7",
                              color:
                                post.is_published
                                  ? "var(--gray-600)"
                                  : "#92400e",
                              fontSize: "11px",
                              padding: "2px 6px",
                            }}
                          >
                            {post.is_published ? 'published' : 'draft'}
                          </span>
                          <span
                            style={{
                              fontSize: "12px",
                              color: "var(--gray-500)",
                            }}
                          >
                            {formatDate(post.created_at)}
                          </span>
                        </div>

                        <h3
                          style={{
                            fontSize: "16px",
                            fontWeight: "600",
                            color: "var(--black)",
                            marginBottom: "8px",
                            lineHeight: "1.4",
                          }}
                        >
                          <Link
                            to={`/post/${post.id}`}
                            style={{
                              color: "inherit",
                              textDecoration: "none",
                              transition: "color 0.15s ease",
                            }}
                            onMouseEnter={(e) =>
                              (e.target.style.color = "var(--gray-600)")
                            }
                            onMouseLeave={(e) =>
                              (e.target.style.color = "var(--black)")
                            }
                          >
                            {post.title}
                          </Link>
                        </h3>

                        {post.is_published && (
                          <div
                            className="flex items-center gap-4"
                            style={{
                              fontSize: "12px",
                              color: "var(--gray-500)",
                            }}
                          >
                            <div className="flex items-center gap-1">
                              <Eye size={12} />
                              <span>{post.views || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp size={12} />
                              <span>{post.likes || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>{post.comments || 0} comments</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/edit/${post.id}`}
                          className="btn btn-ghost"
                          style={{ padding: "6px 12px", fontSize: "12px" }}
                        >
                          Edit
                        </Link>
                        {post.is_published && (
                          <Link
                            to={`/dashboard/post/${post.id}`}
                            className="btn btn-ghost"
                            style={{ padding: "6px 12px", fontSize: "12px" }}
                          >
                            View
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions & Analytics */}
            <div>
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  color: "var(--black)",
                  marginBottom: "24px",
                }}
              >
                Quick actions
              </h2>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <Link
                  to="/create"
                  style={{
                    background: "var(--white)",
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                    textDecoration: "none",
                    color: "inherit",
                    transition: "all 0.15s ease",
                    display: "block",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  <div className="flex items-center gap-3" style={{background:"var(--white)"}}>
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        background: "var(--black)",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--white)",
                      }}
                    >
                      <PenTool size={20} />
                    </div>
                    <div>
                      <h3
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "var(--black)",
                          marginBottom: "4px",
                        }}
                      >
                        Write new post
                      </h3>
                      <p style={{ fontSize: "14px", color: "var(--gray-600)" }}>
                        Share your thoughts with your audience
                      </p>
                    </div>
                  </div>
                </Link>

                <Link
                  to="/analytics"
                  style={{
                    background: "var(--white)",
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                    textDecoration: "none",
                    color: "inherit",
                    transition: "all 0.15s ease",
                    display: "block",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        background: "var(--gray-100)",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--gray-600)",
                      }}
                    >
                      <BarChart3 size={20} />
                    </div>
                    <div>
                      <h3
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "var(--black)",
                          marginBottom: "4px",
                        }}
                      >
                        View analytics
                      </h3>
                      <p style={{ fontSize: "14px", color: "var(--gray-600)" }}>
                        Track your performance and growth
                      </p>
                    </div>
                  </div>
                </Link>

                <Link
                  to="/dashboard/subscribers"
                  style={{
                    background: "var(--white)",
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                    textDecoration: "none",
                    color: "inherit",
                    transition: "all 0.15s ease",
                    display: "block",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        background: "var(--gray-100)",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--gray-600)",
                      }}
                    >
                      <Users size={20} />
                    </div>
                    <div>
                      <h3
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "var(--black)",
                          marginBottom: "4px",
                        }}
                      >
                        Manage subscribers
                      </h3>
                      <p style={{ fontSize: "14px", color: "var(--gray-600)" }}>
                        Connect with your audience
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
