import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, Send } from "lucide-react";
import toast from "react-hot-toast";
import apiService from "../services/api";
import { useAuth } from "../contexts/AuthContext";

function CreatePost() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    summary: "",
    is_published: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e, publish = false) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const postData = {
        ...formData,
        is_published: publish,
      };

      const response = await apiService.createPost(postData);

      if (publish) {
        const successMessage = "Post published successfully!";
        setSuccess(successMessage);
        toast.success(successMessage);
        setTimeout(() => {
          navigate(`/dashboard/post/${response.id}`);
        }, 1500);
      } else {
        const successMessage = "Draft saved successfully!";
        setSuccess(successMessage);
        toast.success(successMessage);
        setTimeout(() => {
          navigate("/dashboard/posts");
        }, 1500);
      }
    } catch (err) {
      const errorMessage = err.message || "Failed to create post";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = (e) => handleSubmit(e, false);
  const handlePublish = (e) => handleSubmit(e, true);

  return (
    <div className="py-8">
      <div className="container">
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mb-8">
            <button
              onClick={handleSaveDraft}
              disabled={loading || !formData.title.trim()}
              className="btn btn-secondary"
              style={{ outline: "none" }}
            >
              {loading ? (
                <div
                  className="spinner"
                  style={{ width: "16px", height: "16px" }}
                ></div>
              ) : (
                <>
                  <Save size={16} />
                  Save Draft
                </>
              )}
            </button>

            <button
              onClick={handlePublish}
              disabled={
                loading || !formData.title.trim() || !formData.content.trim()
              }
              className="btn btn-primary"
              style={{ outline: "none" }}
            >
              {loading ? (
                <div
                  className="spinner"
                  style={{ width: "16px", height: "16px" }}
                ></div>
              ) : (
                <>
                  <Send size={16} />
                  Publish
                </>
              )}
            </button>
          </div>

          {/* Messages */}
          {error && <div className="error mb-6">{error}</div>}

          {success && <div className="success mb-6">{success}</div>}

          {/* Form */}
          <div
            style={{
              background: "var(--white)",
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
              border: "1px solid var(--gray-100)",
              overflow: "hidden",
            }}
          >
            <form onSubmit={handleSaveDraft}>
              {/* Title */}
              <div style={{ padding: "32px 32px 0 32px" }}>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter your post title..."
                  required
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    fontSize: "2rem",
                    fontWeight: "700",
                    color: "var(--black)",
                    background: "transparent",
                    padding: "0",
                    marginBottom: "16px",
                    fontFamily: "inherit",
                    lineHeight: "1.2",
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
                    width: "100%",
                    border: "none",
                    outline: "none",
                    fontSize: "16px",
                    color: "var(--gray-600)",
                    background: "transparent",
                    padding: "0",
                    marginBottom: "24px",
                    fontFamily: "inherit",
                    lineHeight: "1.5",
                    resize: "vertical",
                    minHeight: "60px",
                  }}
                />
              </div>

              {/* Divider */}
              <div
                style={{
                  height: "1px",
                  background: "var(--gray-100)",
                  margin: "0 32px",
                }}
              ></div>

              {/* Content */}
              <div style={{ padding: "32px" }}>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Start writing your post content here..."
                  required
                  rows="20"
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    fontSize: "16px",
                    color: "var(--black)",
                    background: "transparent",
                    padding: "0",
                    fontFamily: "inherit",
                    lineHeight: "1.6",
                    resize: "vertical",
                    minHeight: "400px",
                  }}
                />
              </div>

              {/* Footer */}
              <div
                style={{
                  padding: "24px 32px",
                  background: "var(--gray-50)",
                  borderTop: "1px solid var(--gray-100)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div style={{ fontSize: "14px", color: "var(--gray-600)" }}>
                    Writing as{" "}
                    <strong>{user?.full_name || user?.username}</strong>
                  </div>

                  <div className="flex items-center gap-4">
                    <div style={{ fontSize: "14px", color: "var(--gray-500)" }}>
                      {formData.content.length} characters
                    </div>

                    <div className="flex items-center gap-2">
                      <label
                        style={{
                          fontSize: "14px",
                          color: "var(--gray-600)",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          name="is_published"
                          checked={formData.is_published}
                          onChange={handleChange}
                          style={{ outline: "none" }}
                        />
                        Publish immediately
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Tips */}
          <div
            style={{
              marginTop: "24px",
              padding: "20px",
              background: "var(--gray-50)",
              borderRadius: "12px",
              border: "1px solid var(--gray-200)",
            }}
          >
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "var(--black)",
                marginBottom: "12px",
              }}
            >
              Writing Tips
            </h3>
            <ul
              style={{
                margin: "0",
                paddingLeft: "20px",
                fontSize: "14px",
                color: "var(--gray-600)",
                lineHeight: "1.5",
              }}
            >
              <li>Write a compelling title that captures your main idea</li>
              <li>
                Use the summary to give readers a preview of what to expect
              </li>
              <li>Break up long paragraphs for better readability</li>
              <li>Save drafts frequently to avoid losing your work</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
