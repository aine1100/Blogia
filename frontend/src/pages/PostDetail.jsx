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
import toast from "react-hot-toast";
import AuthorPostView from "../components/AuthorPostView";
import apiService from "../services/api";
import { useAuth } from "../contexts/AuthContext";

function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState(false);
  const [, setLikes] = useState(0);
  const [subscribed, setSubscribed] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);
  const [postStats, setPostStats] = useState({
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
  });

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch post data
      const postData = await apiService.getPost(id);
      setPost(postData);

      // Check if current user is the author
      setIsAuthor(user && user.id === postData.author_id);

      // Fetch post stats
      try {
        const stats = await apiService.getPostStats(id);
        setPostStats(stats);
        setLikes(stats.likes || 0);
      } catch (statsError) {
        console.warn("Failed to fetch post stats:", statsError);
        // Use default stats if API call fails
        setPostStats({
          views: postData.views || 0,
          likes: postData.likes || 0,
          comments: 0,
          shares: 0,
        });
        setLikes(postData.likes || 0);
      }

      // Fetch user interactions if authenticated
      if (user) {
        try {
          const interactions = await apiService.getUserPostInteractions(id);
          setLiked(interactions.liked || false);
        } catch (interactionError) {
          console.warn("Failed to fetch user interactions:", interactionError);
        }
      }

      // Track post view
      try {
        await apiService.trackPostView(id);
      } catch (viewError) {
        console.warn("Failed to track post view:", viewError);
      }

      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to fetch post");
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const commentsData = await apiService.getPostComments(id);
      setComments(commentsData || []);

      // Update comment count in stats
      setPostStats((prev) => ({
        ...prev,
        comments: commentsData?.length || 0,
      }));
    } catch (err) {
      console.error("Failed to fetch comments:", err);
      setComments([]);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error("Please sign in to like posts");
      return;
    }

    try {
      const result = await apiService.togglePostLike(id);
      setLiked(result.liked);
      setLikes(result.total_likes);

      // Update stats
      setPostStats((prev) => ({
        ...prev,
        likes: result.total_likes,
      }));

      toast.success(result.liked ? "Post liked!" : "Like removed");
    } catch (err) {
      console.error("Failed to toggle like:", err);
      toast.error("Failed to update like");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !fullName.trim()) return;

    try {
      const commentData = {
        post_id: parseInt(id),
        content: newComment.trim(),
        author_name: fullName.trim(), // For non-authenticated users
      };

      const newCommentResponse = await apiService.createComment(commentData);

      // Add the new comment to the list
      setComments((prev) => [...prev, newCommentResponse]);
      setNewComment("");
      setFullName("");

      // Update comment count in stats
      setPostStats((prev) => ({
        ...prev,
        comments: prev.comments + 1,
      }));

      toast.success("Comment posted successfully!");
    } catch (err) {
      console.error("Failed to create comment:", err);
      toast.error("Failed to post comment. Please try again.");
    }
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

          {post.summary && (
            <p
              style={{
                fontSize: "1.25rem",
                lineHeight: "1.5",
                color: "var(--gray-600)",
                marginBottom: "32px",
                fontWeight: "400",
              }}
            >
              {post.summary}
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
              {post.author?.full_name?.charAt(0) ||
                post.author?.username?.charAt(0) ||
                "U"}
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
                {post.author?.full_name ||
                  post.author?.username ||
                  "Unknown Author"}
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
                <span>
                  {Math.ceil((post.content?.length || 0) / 200)} min read
                </span>
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
                  outline: "none",
                }}
              >
                <Heart size={18} fill={liked ? "#ef4444" : "none"} />
                <span>{postStats.likes}</span>
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
                  outline: "none",
                }}
              >
                <MessageCircle size={18} />
                <span>{postStats.comments}</span>
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
                {post.author?.full_name?.charAt(0) ||
                  post.author?.username?.charAt(0) ||
                  "U"}
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
                  {post.author?.full_name ||
                    post.author?.username ||
                    "Unknown Author"}
                </h4>
                <p
                  style={{
                    color: "var(--gray-600)",
                    lineHeight: "1.6",
                    fontSize: "15px",
                    marginBottom: "16px",
                  }}
                >
                  {post.author?.bio || "No bio available"}
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
            {postStats.comments}{" "}
            {postStats.comments === 1 ? "comment" : "comments"}
          </h3>

          {/* Comment form */}
          <div
            style={{
              background: "var(--gray-50)",
              padding: "24px",
              borderRadius: "12px",
              marginBottom: "32px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <form
              onSubmit={handleCommentSubmit}
              style={{ gap: "16px", display: "flex", flexDirection: "column" }}
            >
              <input
                type="text"
                id="names"
                name="fullname"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input"
                placeholder="Enter your Full Names"
                required
                style={{ outline: "none" }}
              />
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
                  disabled={!newComment.trim() || !fullName.trim()}
                  style={{ padding: "12px 24px", outline: "none" }}
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
                        {comment.author?.full_name?.charAt(0) ||
                          comment.author?.username?.charAt(0) ||
                          "U"}
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
                            {comment.author?.full_name ||
                              comment.author?.username ||
                              "Unknown User"}
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
                              outline: "none",
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
    </div>
  );
}

export default PostDetail;
