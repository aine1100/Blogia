import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Heart,
  MessageCircle,
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
} from "lucide-react";
import AuthorPostView from "../components/AuthorPostView";

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [subscribed, setSubscribed] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false); // TODO: Get from auth context
  const [postStats] = useState({
    views: 3421,
    likes: 187,
    comments: 45,
    shares: 23,
  });

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const fetchPost = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock post data
      setPost({
        id: parseInt(id),
        title: "Building modern web applications with FastAPI and React",
        subtitle:
          "A comprehensive guide to creating scalable applications with the latest technologies and best practices",
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

**Database Integration**

For our blog application, we'll use SQLAlchemy with PostgreSQL. This combination provides excellent performance and reliability:

\`\`\`python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql://user:password@localhost/dbname"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
\`\`\`

**Frontend with React**

On the frontend side, we'll use React with modern hooks and a clean architecture. Here's how to set up a basic component:

\`\`\`jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts');
      setPosts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.summary}</p>
        </article>
      ))}
    </div>
  );
}
\`\`\`

**Best Practices for Production**

When building applications with this stack, keep these best practices in mind:

1. **API Design**: Follow RESTful principles and use proper HTTP status codes
2. **Error Handling**: Implement comprehensive error handling on both frontend and backend
3. **Authentication**: Use JWT tokens for secure authentication
4. **Testing**: Write unit and integration tests for both components
5. **Documentation**: Keep your API documentation up to date
6. **Performance**: Implement caching strategies and optimize database queries

**Deployment Strategy**

For production deployment, I recommend this approach:

• **Backend**: Docker containers with Gunicorn for production WSGI server
• **Frontend**: Static hosting with CDN (Vercel, Netlify, or AWS CloudFront)
• **Database**: Managed PostgreSQL service (AWS RDS, Google Cloud SQL)
• **Monitoring**: Application performance monitoring with tools like Sentry or DataDog

**Conclusion**

FastAPI and React make an excellent combination for modern web applications. The type safety, performance, and developer experience they provide make them ideal choices for both startups and enterprise applications.

This stack allows you to build scalable, maintainable applications that can grow with your business needs. The key is to follow best practices, maintain clean and well-documented code, and always keep security and performance in mind.

*What's your experience with FastAPI and React? Have you tried this combination for your projects? I'd love to hear your thoughts in the comments below.*`,
        summary:
          "A comprehensive guide to creating scalable applications with the latest technologies and best practices.",
        created_at: "2024-01-15T10:30:00Z",
        updated_at: "2024-01-15T10:30:00Z",
        author: {
          full_name: "John Doe",
          username: "john_doe",
          bio: "Senior Software Engineer with 8+ years of experience building scalable web applications. Passionate about clean code and modern development practices.",
          avatar: null,
        },
        read_time: 8,
        category: "Development",
      });

      setLikes(42);
      // TODO: Check if current user is the author
      setIsAuthor(true); // Mock - set to true to show author view
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch post");
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      // Mock comments data
      setComments([
        {
          id: 1,
          content:
            "Great article! I've been looking for a comprehensive guide like this. The code examples are really helpful.",
          created_at: "2024-01-16T09:30:00Z",
          author: { full_name: "Alice Johnson", username: "alice_j" },
        },
        {
          id: 2,
          content:
            "Thanks for sharing this. I'm currently working on a similar project and this gives me some great ideas for the architecture.",
          created_at: "2024-01-16T14:15:00Z",
          author: { full_name: "Bob Smith", username: "bob_smith" },
        },
        {
          id: 3,
          content:
            "The FastAPI section is particularly well written. Would love to see a follow-up article on deployment strategies.",
          created_at: "2024-01-17T11:45:00Z",
          author: { full_name: "Carol Davis", username: "carol_d" },
        },
      ]);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: comments.length + 1,
      content: newComment,
      created_at: new Date().toISOString(),
      author: { full_name: "Current User", username: "current_user" },
    };

    setComments([...comments, comment]);
    setNewComment("");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container py-8">
        <div className="error">{error || "Post not found"}</div>
        <Link
          to="/"
          className="btn btn-secondary"
          style={{ marginTop: "16px" }}
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Back button */}
      <div className="container py-4" style={{ padding: "16px 32px" }}>
        <Link
          to="/posts"
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
          <ArrowLeft size={16} />
          Back to articles
        </Link>
      </div>

      {/* Article */}
      <article
        style={{ maxWidth: "680px", margin: "0 auto", padding: "0 32px" }}
      >
        {/* Header */}
        <header style={{ marginBottom: "48px" }}>
          <h1
            style={{
              fontSize: "clamp(2.5rem, 6vw, 3.5rem)",
              fontWeight: "700",
              lineHeight: "1.1",
              marginBottom: "16px",
              color: "var(--black)",
              letterSpacing: "-0.02em",
            }}
          >
            {post.title}
          </h1>

          {post.subtitle && (
            <p
              style={{
                fontSize: "1.25rem",
                lineHeight: "1.5",
                color: "var(--gray-600)",
                marginBottom: "32px",
                fontWeight: "400",
              }}
            >
              {post.subtitle}
            </p>
          )}

          {/* Author info */}
          <div className="flex items-center gap-4 mb-6">
            <div
              style={{
                width: "56px",
                height: "56px",
                background: "var(--black)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--white)",
                fontSize: "20px",
                fontWeight: "600",
              }}
            >
              {post.author.full_name.charAt(0)}
            </div>
            <div>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "var(--black)",
                  marginBottom: "4px",
                }}
              >
                {post.author.full_name}
              </p>
              <div
                className="flex items-center gap-3"
                style={{
                  fontSize: "14px",
                  color: "var(--gray-500)",
                }}
              >
                <span>{formatDate(post.created_at)}</span>
                <span>•</span>
                <span>{post.read_time} min read</span>
              </div>
            </div>
          </div>

          {/* Action bar */}
          <div
            className="flex items-center justify-between py-4"
            style={{
              borderTop: "1px solid var(--gray-100)",
              borderBottom: "1px solid var(--gray-100)",
            }}
          >
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className="flex items-center gap-2"
                style={{
                  background: "none",
                  border: "none",
                  color: liked ? "#ef4444" : "var(--gray-600)",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "color 0.15s ease",
                }}
              >
                <Heart size={18} fill={liked ? "#ef4444" : "none"} />
                <span>{likes}</span>
              </button>
              <button
                className="flex items-center gap-2"
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--gray-600)",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                <MessageCircle size={18} />
                <span>{comments.length}</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--gray-600)",
                  cursor: "pointer",
                }}
              >
                <Twitter size={18} />
              </button>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--gray-600)",
                  cursor: "pointer",
                }}
              >
                <Facebook size={18} />
              </button>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--gray-600)",
                  cursor: "pointer",
                }}
              >
                <Linkedin size={18} />
              </button>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--gray-600)",
                  cursor: "pointer",
                }}
              >
                <Mail size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Article content - Substack style */}
        <div
          className="mb-12"
          style={{
            lineHeight: "1.8",
            fontSize: "18px",
            color: "var(--black)",
          }}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: post.content
                .replace(
                  /\*\*(.*?)\*\*/g,
                  '<strong style="font-weight: 600;">$1</strong>'
                )
                .replace(/\*(.*?)\*/g, "<em>$1</em>")
                .replace(
                  /^• (.+)$/gm,
                  '<li style="margin: 8px 0; padding-left: 8px;">$1</li>'
                )
                .replace(
                  /(<li.*<\/li>)/gs,
                  '<ul style="margin: 16px 0; padding-left: 20px;">$1</ul>'
                )
                .replace(
                  /^(\d+)\. (.+)$/gm,
                  '<li style="margin: 8px 0; padding-left: 8px;">$2</li>'
                )
                .replace(
                  /```(\w+)?\n([\s\S]*?)```/g,
                  "<pre style=\"background: var(--gray-50); padding: 20px; border-radius: 8px; overflow-x: auto; margin: 24px 0; font-family: 'SF Mono', Monaco, monospace; font-size: 15px; line-height: 1.6; border-left: 4px solid var(--gray-200);\"><code>$2</code></pre>"
                )
                .replace(
                  /`([^`]+)`/g,
                  "<code style=\"background: var(--gray-100); padding: 3px 6px; border-radius: 4px; font-family: 'SF Mono', Monaco, monospace; font-size: 15px; color: var(--gray-800);\">$1</code>"
                )
                .replace(
                  /\n\n/g,
                  '</p><p style="margin: 24px 0; line-height: 1.8; color: var(--black);">'
                )
                .replace(
                  /^(?!<[h|p|c|u|l|s])(.+)$/gm,
                  '<p style="margin: 24px 0; line-height: 1.8; color: var(--black);">$1</p>'
                ),
            }}
          />
        </div>

        {/* Author View or Bio */}
        {isAuthor ? (
          <AuthorPostView post={post} stats={postStats} />
        ) : (
          <div
            style={{
              background: "var(--gray-50)",
              padding: "32px",
              borderRadius: "12px",
              marginBottom: "48px",
            }}
          >
            <div className="flex items-start gap-4">
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  background: "var(--black)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--white)",
                  fontSize: "24px",
                  fontWeight: "600",
                  flexShrink: 0,
                }}
              >
                {post.author.full_name.charAt(0)}
              </div>
              <div>
                <h4
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "var(--black)",
                    marginBottom: "8px",
                  }}
                >
                  {post.author.full_name}
                </h4>
                <p
                  style={{
                    color: "var(--gray-600)",
                    lineHeight: "1.6",
                    fontSize: "15px",
                    marginBottom: "16px",
                  }}
                >
                  {post.author.bio}
                </p>
                <button
                  onClick={() => setSubscribed(!subscribed)}
                  className="btn"
                  style={{
                    background: subscribed ? "var(--gray-200)" : "var(--black)",
                    color: subscribed ? "var(--black)" : "var(--white)",
                    fontSize: "14px",
                    padding: "8px 16px",
                  }}
                >
                  {subscribed ? "Subscribed" : "Follow"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Comments section - Substack style */}
        <section>
          <h3
            style={{
              fontSize: "24px",
              fontWeight: "600",
              marginBottom: "24px",
              color: "var(--black)",
            }}
          >
            {comments.length} {comments.length === 1 ? "comment" : "comments"}
          </h3>

          {/* Comment form */}
          <div
            style={{
              background: "var(--gray-50)",
              padding: "24px",
              borderRadius: "12px",
              marginBottom: "32px",
            }}
          >
            <form onSubmit={handleCommentSubmit}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="What are your thoughts?"
                style={{
                  width: "100%",
                  minHeight: "120px",
                  padding: "16px",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  lineHeight: "1.6",
                  resize: "vertical",
                  background: "var(--white)",
                  marginBottom: "16px",
                  fontFamily: "inherit",
                }}
              />
              <div className="flex justify-between items-center">
                <p style={{ fontSize: "14px", color: "var(--gray-500)" }}>
                  Be respectful and constructive in your comments.
                </p>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!newComment.trim()}
                  style={{ padding: "12px 24px" }}
                >
                  Post comment
                </button>
              </div>
            </form>
          </div>

          {/* Comments list */}
          <div>
            {comments.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle
                  size={48}
                  style={{ color: "var(--gray-300)", margin: "0 auto 16px" }}
                />
                <p style={{ color: "var(--gray-600)", fontSize: "16px" }}>
                  No comments yet. Start the conversation!
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    style={{
                      paddingBottom: "24px",
                      borderBottom: "1px solid var(--gray-100)",
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        style={{
                          width: "44px",
                          height: "44px",
                          background: "var(--gray-200)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--gray-600)",
                          fontSize: "16px",
                          fontWeight: "600",
                          flexShrink: 0,
                        }}
                      >
                        {comment.author.full_name.charAt(0)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div className="flex items-center gap-2 mb-2">
                          <p
                            style={{
                              fontSize: "15px",
                              fontWeight: "600",
                              color: "var(--black)",
                            }}
                          >
                            {comment.author.full_name}
                          </p>
                          <span
                            style={{
                              fontSize: "13px",
                              color: "var(--gray-500)",
                            }}
                          >
                            {formatRelativeTime(comment.created_at)}
                          </span>
                        </div>
                        <p
                          style={{
                            color: "var(--gray-700)",
                            lineHeight: "1.7",
                            fontSize: "16px",
                          }}
                        >
                          {comment.content}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <button
                            style={{
                              background: "none",
                              border: "none",
                              color: "var(--gray-500)",
                              fontSize: "13px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <Heart size={14} />
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </article>

      {/* Newsletter signup - Substack style */}
      <div
        style={{
          background: "var(--black)",
          color: "var(--white)",
          padding: "48px 24px",
          marginTop: "64px",
        }}
      >
        <div
          style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}
        >
          <h3
            style={{
              fontSize: "28px",
              fontWeight: "600",
              marginBottom: "16px",
              color: "var(--white)",
            }}
          >
            Never miss a post
          </h3>
          <p
            style={{
              fontSize: "18px",
              color: "rgba(255, 255, 255, 0.8)",
              marginBottom: "32px",
              lineHeight: "1.6",
            }}
          >
            Get the latest insights on web development, design, and technology
            delivered to your inbox.
          </p>
          <div
            className="flex gap-3"
            style={{ maxWidth: "400px", margin: "0 auto" }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                flex: 1,
                padding: "16px",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
              }}
            />
            <button
              className="btn"
              style={{
                background: "var(--white)",
                color: "var(--black)",
                padding: "16px 24px",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              Subscribe
            </button>
          </div>
          <p
            style={{
              fontSize: "14px",
              color: "rgba(255, 255, 255, 0.6)",
              marginTop: "16px",
            }}
          >
            No spam, unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;
