import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import apiService from "../services/api";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch published posts for home page (limit to 4 for featured section)
      const response = await apiService.getPosts(0, 4);
      setPosts(response || []);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch posts");
      setLoading(false);
      console.error("Error fetching posts:", err);
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
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section - Atomize Style */}
      <section className="py-24" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <div className="container" style={{ padding: '0 32px' }}>
          <div
            style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}
          >
            <h1
              className="mb-6 animate-fade-in"
              style={{
                fontSize: "clamp(3rem, 8vw, 5rem)",
                fontWeight: "700",
                lineHeight: "1.1",
                letterSpacing: "-0.03em",
                color: "var(--black)",
              }}
            >
              Stories worth reading
            </h1>

            <p
              className="text-xl mb-8 animate-slide-up delay-100"
              style={{
                color: "var(--gray-600)",
                maxWidth: "600px",
                margin: "0 auto 48px",
                lineHeight: "1.6",
              }}
            >
              Discover insights from industry experts and thought leaders.
              Learn, grow, and stay ahead with quality content.
            </p>

            <div className="flex gap-4 justify-center animate-slide-up delay-200">
              <Link
                to="/register"
                className="btn btn-primary"
                style={{ padding: "16px 24px" }}
              >
                Start reading
              </Link>
              <Link
                to="#articles"
                className="btn btn-secondary"
                style={{ padding: "16px 24px" }}
              >
                Browse articles
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16" style={{ background: "var(--gray-50)", padding: '64px 0' }}>
        <div className="container" style={{ padding: '0 32px' }}>
          <div
            className="grid grid-3"
            style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}
          >
            <div className="animate-fade-in delay-100">
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "700",
                  color: "var(--black)",
                  marginBottom: "8px",
                }}
              >
                10K+
              </div>
              <p style={{ color: "var(--gray-600)", fontSize: "14px" }}>
                Readers
              </p>
            </div>
            <div className="animate-fade-in delay-200">
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "700",
                  color: "var(--black)",
                  marginBottom: "8px",
                }}
              >
                500+
              </div>
              <p style={{ color: "var(--gray-600)", fontSize: "14px" }}>
                Articles
              </p>
            </div>
            <div className="animate-fade-in delay-300">
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "700",
                  color: "var(--black)",
                  marginBottom: "8px",
                }}
              >
                50+
              </div>
              <p style={{ color: "var(--gray-600)", fontSize: "14px" }}>
                Writers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section id="articles" className="py-20" style={{ padding: '80px 0' }}>
        <div className="container" style={{ padding: '0 32px' }}>
          <div className="text-center mb-16">
            <h2
              className="mb-4"
              style={{ fontSize: "2.5rem", fontWeight: "600" }}
            >
              Latest articles
            </h2>
            <p
              style={{
                color: "var(--gray-600)",
                fontSize: "18px",
                maxWidth: "500px",
                margin: "0 auto",
              }}
            >
              Fresh insights and stories from our community
            </p>
          </div>

          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            {posts.map((post, index) => (
              <article
                key={post.id}
                className={`animate-slide-up delay-${(index + 1) * 100}`}
                style={{
                  paddingBottom: "48px",
                  marginBottom: "48px",
                  borderBottom:
                    index < posts.length - 1
                      ? "1px solid var(--gray-100)"
                      : "none",
                }}
              >
                {/* Author info */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      background: "var(--black)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--white)",
                      fontSize: "10px",
                      fontWeight: "600",
                    }}
                  >
                    {post.author?.full_name?.charAt(0) || post.author?.username?.charAt(0) || "U"}
                  </div>
                  <div
                    className="flex items-center gap-2"
                    style={{ fontSize: "14px", color: "var(--gray-600)" }}
                  >
                    <span style={{ fontWeight: "500" }}>
                      {post.author?.full_name || post.author?.username || "Unknown Author"}
                    </span>
                    <span>•</span>
                    <span>{formatDate(post.created_at)}</span>
                  </div>
                </div>

                {/* Post content */}
                <Link
                  to={`/post/${post.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <h2
                    style={{
                      fontSize: "clamp(1.5rem, 3vw, 2rem)",
                      fontWeight: "700",
                      marginBottom: "12px",
                      lineHeight: "1.2",
                      color: "var(--black)",
                      transition: "color 0.15s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.color = "var(--gray-600)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.color = "var(--black)")
                    }
                  >
                    {post.title}
                  </h2>

                  <p
                    style={{
                      color: "var(--gray-600)",
                      lineHeight: "1.6",
                      marginBottom: "16px",
                      fontSize: "16px",
                    }}
                  >
                    {post.summary}
                  </p>
                </Link>

                {/* Post meta */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span
                      className="badge"
                      style={{
                        background: "var(--gray-100)",
                        color: "var(--gray-600)",
                        fontSize: "12px",
                        padding: "4px 8px",
                      }}
                    >
                      {post.category || "Article"}
                    </span>
                    <div
                      className="flex items-center gap-1"
                      style={{ color: "var(--gray-500)", fontSize: "13px" }}
                    >
                      <Clock size={12} />
                      <span>{Math.ceil((post.content?.length || 0) / 200)} min read</span>
                    </div>
                  </div>

                  <Link
                    to={`/post/${post.id}`}
                    style={{
                      color: "var(--gray-500)",
                      textDecoration: "none",
                      fontSize: "13px",
                      fontWeight: "500",
                      transition: "color 0.15s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.color = "var(--black)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.color = "var(--gray-500)")
                    }
                  >
                    Read more →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center" style={{ marginTop: "48px" }}>
            <Link to="/posts" className="btn btn-secondary">
              View all articles
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20"
        style={{ background: "var(--black)", color: "var(--white)", padding: '80px 0' }}
      >
        <div className="container text-center" style={{ padding: '0 32px' }}>
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <h2
              className="mb-6"
              style={{
                fontSize: "2.5rem",
                fontWeight: "600",
                color: "var(--white)",
              }}
            >
              Start writing today
            </h2>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: "18px",
                lineHeight: "1.6",
                marginBottom: "32px",
              }}
            >
              Join our community of writers and share your expertise with
              readers worldwide.
            </p>
            <Link
              to="/register"
              className="btn"
              style={{
                background: "var(--white)",
                color: "var(--black)",
                padding: "16px 24px",
              }}
            >
              Get started
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
