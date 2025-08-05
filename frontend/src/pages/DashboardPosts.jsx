import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Eye,
  Edit3,
  MoreHorizontal,
  TrendingUp,
} from "lucide-react";
import CustomDropdown from "../components/CustomDropdown";
import apiService from "../services/api";


function DashboardPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all, published, draft
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date"); // date, views, title

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError("");

      // Get current user's posts (both published and drafts)
      const response = await apiService.getMyPosts(0, 100);
      setPosts(response || []);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setError("Failed to load posts. Please try again.");
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

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const filteredPosts = posts.filter((post) => {
    const status = post.is_published ? "published" : "draft";
    const matchesFilter = filter === "all" || status === filter;
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.summary &&
        post.summary.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "views":
        return (b.views || 0) - (a.views || 0);
      case "title":
        return a.title.localeCompare(b.title);
      case "date":
      default:
        return new Date(b.created_at) - new Date(a.created_at);
    }
  });

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <div
          className="spinner"
          style={{ width: "32px", height: "32px" }}
        ></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <div className="container">
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <div className="error" style={{ marginBottom: "16px" }}>
              {error}
            </div>
            <button onClick={fetchPosts} className="btn btn-primary">
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
            <div className="flex items-center gap-4">
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
                Posts
              </h1>
            </div>

            <Link to="/create" className="btn btn-primary">
              <Plus size={16} />
              New post
            </Link>
          </div>

          {/* Filters and Search */}
          <div
            className="flex items-center justify-between mb-8"
            style={{
              background: "var(--white)",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div className="flex items-center gap-4">
              {/* Filter Tabs */}
              <div className="flex items-center gap-2">
                {[
                  { key: "all", label: "All posts", count: posts.length },
                  {
                    key: "published",
                    label: "Published",
                    count: posts.filter((p) => p.is_published).length,
                  },
                  {
                    key: "draft",
                    label: "Drafts",
                    count: posts.filter((p) => !p.is_published).length,
                  },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key)}
                    className={
                      filter === tab.key ? "btn btn-primary" : "btn btn-ghost"
                    }
                    style={{
                      fontSize: "14px",
                      padding: "8px 16px",
                    }}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>

              {/* Search */}
              <div style={{ position: "relative", minWidth: "300px" }}>
                <Search
                  size={16}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--gray-400)",
                  }}
                />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input"
                  style={{ paddingLeft: "40px", outline: "none" }}
                />
              </div>
            </div>

            {/* Sort */}
            <CustomDropdown
              value={sortBy}
              onChange={setSortBy}
              options={[
                { value: "date", label: "Sort by date" },
                { value: "views", label: "Sort by views" },
                { value: "title", label: "Sort by title" },
              ]}
              placeholder="Sort posts"
              icon={Filter}
            />
          </div>

          {/* Posts List */}
          {sortedPosts.length === 0 ? (
            <div className="text-center py-16">
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  background: "var(--gray-100)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                  color: "var(--gray-400)",
                }}
              >
                <Plus size={32} />
              </div>
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  marginBottom: "16px",
                }}
              >
                {searchTerm ? "No posts found" : "No posts yet"}
              </h3>
              <p style={{ color: "var(--gray-600)", marginBottom: "32px" }}>
                {searchTerm
                  ? "Try adjusting your search terms or filters."
                  : "Start writing your first post to share your thoughts with the world."}
              </p>
              {!searchTerm && (
                <Link to="/create" className="btn btn-primary">
                  <Plus size={16} />
                  Create your first post
                </Link>
              )}
            </div>
          ) : (
            <div
              style={{
                background: "var(--white)",
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
              }}
            >
              {sortedPosts.map((post, index) => (
                <div
                  key={post.id}
                  style={{
                    padding: "24px",
                    borderBottom:
                      index < sortedPosts.length - 1
                        ? "1px solid var(--gray-100)"
                        : "none",
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div style={{ flex: 1 }}>
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className="badge"
                          style={{
                            background: post.is_published
                              ? "#f0fdf4"
                              : "#fef3c7",
                            color: post.is_published ? "#059669" : "#92400e",
                            fontSize: "12px",
                            padding: "4px 8px",
                            fontWeight: "500",
                          }}
                        >
                          {post.is_published ? "published" : "draft"}
                        </span>
                        <span
                          style={{ fontSize: "12px", color: "var(--gray-500)" }}
                        >
                          {post.is_published
                            ? `Published ${formatDate(post.created_at)}`
                            : `Created ${formatDate(post.created_at)}`}
                        </span>
                      </div>

                      <h3
                        style={{
                          fontSize: "20px",
                          fontWeight: "600",
                          color: "var(--black)",
                          marginBottom: "8px",
                          lineHeight: "1.4",
                        }}
                      >
                        <Link
                          to={`/dashboard/post/${post.id}`}
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

                      {post.summary && (
                        <p
                          style={{
                            color: "var(--gray-600)",
                            lineHeight: "1.6",
                            marginBottom: "16px",
                            fontSize: "14px",
                          }}
                        >
                          {post.summary}
                        </p>
                      )}

                      {post.is_published && (
                        <div
                          className="flex items-center gap-6"
                          style={{ fontSize: "14px", color: "var(--gray-500)" }}
                        >
                          <div className="flex items-center gap-1">
                            <Eye size={14} />
                            <span>{formatNumber(post.views || 0)} views</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp size={14} />
                            <span>{post.likes || 0} likes</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>{post.comments || 0} comments</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/edit/${post.id}`}
                        className="btn btn-ghost"
                        style={{ padding: "8px 12px", fontSize: "12px" }}
                      >
                        <Edit3 size={14} />
                        Edit
                      </Link>

                      {post.is_published && (
                        <Link
                          to={`/dashboard/post/${post.id}`}
                          className="btn btn-ghost"
                          style={{ padding: "8px 12px", fontSize: "12px" }}
                        >
                          <Eye size={14} />
                          View
                        </Link>
                      )}

                      <button
                        className="btn btn-ghost"
                        style={{ padding: "8px", color: "var(--gray-500)" }}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stats Summary */}
          {sortedPosts.length > 0 && (
            <div
              style={{
                marginTop: "24px",
                padding: "20px",
                background: "var(--gray-50)",
                borderRadius: "12px",
                textAlign: "center",
              }}
            >
              <div
                className="flex items-center justify-center gap-8"
                style={{ fontSize: "14px", color: "var(--gray-600)" }}
              >
                <div>
                  <span style={{ fontWeight: "600", color: "var(--black)" }}>
                    {sortedPosts.length}
                  </span>{" "}
                  posts shown
                </div>
                <div>
                  <span style={{ fontWeight: "600", color: "var(--black)" }}>
                    {formatNumber(
                      sortedPosts.reduce(
                        (sum, post) => sum + (post.views || 0),
                        0
                      )
                    )}
                  </span>{" "}
                  total views
                </div>
                <div>
                  <span style={{ fontWeight: "600", color: "var(--black)" }}>
                    {sortedPosts.reduce(
                      (sum, post) => sum + (post.likes || 0),
                      0
                    )}
                  </span>{" "}
                  total likes
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPosts;
