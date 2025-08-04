import { Link } from "react-router-dom";
import {
  Mail,
  Twitter,
  Linkedin,
  Github,
  MapPin,
  Calendar,
} from "lucide-react";

function About() {
  return (
    <div className="py-12">
      <div className="container">
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          {/* Header */}
          <div className="text-center mb-16">
            <div
              style={{
                width: "120px",
                height: "120px",
                background:
                  "linear-gradient(135deg, var(--black) 0%, var(--gray-700) 100%)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--white)",
                fontSize: "48px",
                fontWeight: "700",
                margin: "0 auto 24px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              }}
            >
              DA
            </div>

            <h1
              style={{
                fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                fontWeight: "700",
                marginBottom: "16px",
                color: "var(--black)",
                letterSpacing: "-0.02em",
              }}
            >
              Dushimire Aine
            </h1>

            <p
              style={{
                fontSize: "20px",
                color: "var(--gray-600)",
                marginBottom: "24px",
                lineHeight: "1.6",
              }}
            >
              Founder & Writer at Blogio

            </p>

            <div className="flex items-center justify-center gap-6 mb-8">
              <div
                className="flex items-center gap-2"
                style={{ color: "var(--gray-500)", fontSize: "14px" }}
              >
                <MapPin size={16} />
                <span>Rwanda</span>
              </div>
              <div
                className="flex items-center gap-2"
                style={{ color: "var(--gray-500)", fontSize: "14px" }}
              >
                <Calendar size={16} />
                <span>Writing since 2025</span>
              </div>
            </div>

            {/* Social links */}
            <div className="flex items-center justify-center gap-4">
              <a
                href="mailto:ainedushimire@gmail.com"
                style={{
                  color: "var(--gray-600)",
                  transition: "color 0.15s ease",
                  padding: "8px",
                }}
                onMouseEnter={(e) => (e.target.style.color = "var(--black)")}
                onMouseLeave={(e) => (e.target.style.color = "var(--gray-600)")}
              >
                <Mail size={20} />
              </a>
              <a
                href="https://twitter.com/aine_dushimire"
                style={{
                  color: "var(--gray-600)",
                  transition: "color 0.15s ease",
                  padding: "8px",
                }}
                onMouseEnter={(e) => (e.target.style.color = "var(--black)")}
                onMouseLeave={(e) => (e.target.style.color = "var(--gray-600)")}
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://linkedin.com/in/dushimire-aine"
                style={{
                  color: "var(--gray-600)",
                  transition: "color 0.15s ease",
                  padding: "8px",
                }}
                onMouseEnter={(e) => (e.target.style.color = "var(--black)")}
                onMouseLeave={(e) => (e.target.style.color = "var(--gray-600)")}
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://github.com/aine1100"
                style={{
                  color: "var(--gray-600)",
                  transition: "color 0.15s ease",
                  padding: "8px",
                }}
                onMouseEnter={(e) => (e.target.style.color = "var(--black)")}
                onMouseLeave={(e) => (e.target.style.color = "var(--gray-600)")}
              >
                <Github size={20} />
              </a>
            </div>
          </div>

          {/* Bio */}
          <div className="mb-16">
            <div
              style={{
                fontSize: "18px",
                lineHeight: "1.8",
                color: "var(--black)",
                marginBottom: "32px",
              }}
            >
              <p style={{ marginBottom: "24px" }}>
                Hello! I'm Dushimire Aine, a passionate writer and software
                developer from Rwanda. I founded Blogio with a simple mission:
                to create a platform where ideas can flourish and meaningful
                conversations can take place.
              </p>

              <p style={{ marginBottom: "24px" }}>
                My journey into writing began during my computer science
                studies, where I discovered the power of sharing knowledge and
                experiences. What started as documenting my learning process
                evolved into a deep passion for storytelling and connecting with
                people through words.
              </p>

              <p style={{ marginBottom: "24px" }}>
                Through Blogio, I aim to bridge the gap between technical
                expertise and accessible communication. Whether I'm writing
                about the latest web development trends, sharing insights on
                building scalable applications, or exploring the intersection of
                technology and society, my goal is always to inform, inspire,
                and engage.
              </p>

              <p>
                When I'm not writing or coding, you can find me exploring
                Rwanda's beautiful landscapes, reading about emerging
                technologies, or mentoring young developers in my community. I
                believe in the power of technology to transform lives and
                communities, and I'm committed to using my platform to share
                that vision.
              </p>
            </div>
          </div>

          {/* What I write about */}
          <div className="mb-16">
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "600",
                marginBottom: "24px",
                color: "var(--black)",
              }}
            >
              What I write about
            </h2>

            <div className="grid grid-2 gap-6">
              <div
                style={{
                  background: "var(--gray-50)",
                  padding: "24px",
                  borderRadius: "12px",
                }}
              >
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    marginBottom: "12px",
                    color: "var(--black)",
                  }}
                >
                  Web Development
                </h3>
                <p
                  style={{
                    color: "var(--gray-600)",
                    lineHeight: "1.6",
                    fontSize: "15px",
                  }}
                >
                  Modern frameworks, best practices, and the latest trends in
                  building scalable web applications.
                </p>
              </div>

              <div
                style={{
                  background: "var(--gray-50)",
                  padding: "24px",
                  borderRadius: "12px",
                }}
              >
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    marginBottom: "12px",
                    color: "var(--black)",
                  }}
                >
                  Technology & Society
                </h3>
                <p
                  style={{
                    color: "var(--gray-600)",
                    lineHeight: "1.6",
                    fontSize: "15px",
                  }}
                >
                  How technology shapes our world and the responsibility we have
                  as creators and users.
                </p>
              </div>

              <div
                style={{
                  background: "var(--gray-50)",
                  padding: "24px",
                  borderRadius: "12px",
                }}
              >
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    marginBottom: "12px",
                    color: "var(--black)",
                  }}
                >
                  Career Growth
                </h3>
                <p
                  style={{
                    color: "var(--gray-600)",
                    lineHeight: "1.6",
                    fontSize: "15px",
                  }}
                >
                  Insights on building a successful career in tech, from junior
                  developer to leadership roles.
                </p>
              </div>

              <div
                style={{
                  background: "var(--gray-50)",
                  padding: "24px",
                  borderRadius: "12px",
                }}
              >
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    marginBottom: "12px",
                    color: "var(--black)",
                  }}
                >
                  African Tech
                </h3>
                <p
                  style={{
                    color: "var(--gray-600)",
                    lineHeight: "1.6",
                    fontSize: "15px",
                  }}
                >
                  Celebrating innovation and entrepreneurship in the African
                  tech ecosystem.
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-16">
            <div className="grid grid-3 gap-8 text-center">
              <div>
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: "700",
                    color: "var(--black)",
                    marginBottom: "8px",
                  }}
                >
                  50+
                </div>
                <p style={{ color: "var(--gray-600)", fontSize: "14px" }}>
                  Articles Published
                </p>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: "700",
                    color: "var(--black)",
                    marginBottom: "8px",
                  }}
                >
                  10K+
                </div>
                <p style={{ color: "var(--gray-600)", fontSize: "14px" }}>
                  Readers Reached
                </p>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: "700",
                    color: "var(--black)",
                    marginBottom: "8px",
                  }}
                >
                  4+
                </div>
                <p style={{ color: "var(--gray-600)", fontSize: "14px" }}>
                  Years Writing
                </p>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div
            style={{
              background: "var(--gray-50)",
              padding: "48px 32px",
              borderRadius: "16px",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "600",
                marginBottom: "16px",
                color: "var(--black)",
              }}
            >
              Let's connect
            </h2>
            <p
              style={{
                color: "var(--gray-600)",
                fontSize: "16px",
                lineHeight: "1.6",
                marginBottom: "32px",
                maxWidth: "500px",
                margin: "0 auto 32px",
              }}
            >
              I love hearing from readers and fellow developers. Whether you
              have questions, feedback, or just want to say hello, don't
              hesitate to reach out.
            </p>
            <div
              className="flex gap-4 justify-center"
              style={{ flexWrap: "wrap" }}
            >
              <a
                href="mailto:dushimire.aine@example.com"
                className="btn btn-primary"
                style={{ padding: "12px 24px" }}
              >
                <Mail size={16} />
                Send me an email
              </a>
              <Link
                to="/posts"
                className="btn btn-secondary"
                style={{ padding: "12px 24px" }}
              >
                Read my articles
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
