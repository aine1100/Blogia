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

function DashboardPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, published, draft
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date"); // date, views, title

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      setPosts([
        {
          id: 1,
          title: "Building Modern Web Applications with FastAPI and React",
          summary:
            "A comprehensive guide to creating scalable applications with the latest technologies and best practices.",
          status: "published",
          views: 3421,
          likes: 187,
          comments: 45,
          created_at: "2024-01-15T10:30:00Z",
          published_at: "2024-01-15T10:30:00Z",
          category: "Development",
        },
        {
          id: 2,
          title: "The Art of Minimal Design",
          summary:
            "Exploring principles of minimalist design and how to apply them effectively in digital products.",
          status: "published",
          views: 2156,
          likes: 134,
          comments: 28,
          created_at: "2024-01-12T15:45:00Z",
          published_at: "2024-01-12T15:45:00Z",
          category: "Design",
        },
        {
          id: 3,
          title: "Understanding User Experience Through Data",
          summary:
            "How to leverage analytics and user research to make informed design decisions that users love.",
          status: "draft",
          views: 0,
          likes: 0,
          comments: 0,
          created_at: "2024-01-10T09:20:00Z",
          published_at: null,
          category: "UX Research",
        },
        {
          id: 4,
          title: "API Design Best Practices for Modern Applications",
          summary:
            "Essential guidelines for designing robust, scalable APIs that stand the test of time.",
          status: "published",
          views: 1892,
          likes: 98,
          comments: 22,
          created_at: "2024-01-08T14:30:00Z",
          published_at: "2024-01-08T14:30:00Z",
          category: "Backend",
        },
        {
          id: 5,
          title: "The Future of Frontend Development",
          summary:
            "Exploring emerging trends in frontend development and what's coming next.",
          status: "draft",
          views: 0,
          likes: 0,
          comments: 0,
          created_at: "2024-01-05T11:15:00Z",
          published_at: null,
          category: "Frontend",
        },
      ]);

      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
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
    const matchesFilter = filter === "all" || post.status === filter;
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "views":
        return b.views - a.views;
      case "title":
        return a.title.localeCompare(b.title);
      case "date":
      default:
        return new Date(b.created_at) - new Date(a.created_at);
    }
  });

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
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
                    count: posts.filter((p) => p.status === "published").length,
                  },
                  {
                    key: "draft",
                    label: "Drafts",
                    count: posts.filter((p) => p.status === "draft").length,
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
                            background:
                              post.status === "published"
                                ? "#f0fdf4"
                                : "#fef3c7",
                            color:
                              post.status === "published"
                                ? "#059669"
                                : "#92400e",
                            fontSize: "12px",
                            padding: "4px 8px",
                            fontWeight: "500",
                          }}
                        >
                          {post.status}
                        </span>
                        <span className="badge" style={{ fontSize: "11px" }}>
                          {post.category}
                        </span>
                        <span
                          style={{ fontSize: "12px", color: "var(--gray-500)" }}
                        >
                          {post.published_at
                            ? `Published ${formatDate(post.published_at)}`
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

                      {post.status === "published" && (
                        <div
                          className="flex items-center gap-6"
                          style={{ fontSize: "14px", color: "var(--gray-500)" }}
                        >
                          <div className="flex items-center gap-1">
                            <Eye size={14} />
                            <span>{formatNumber(post.views)} views</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp size={14} />
                            <span>{post.likes} likes</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>{post.comments} comments</span>
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

                      {post.status === "published" && (
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
                      sortedPosts.reduce((sum, post) => sum + post.views, 0)
                    )}
                  </span>{" "}
                  total views
                </div>
                <div>
                  <span style={{ fontWeight: "600", color: "var(--black)" }}>
                    {sortedPosts.reduce((sum, post) => sum + post.likes, 0)}
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
