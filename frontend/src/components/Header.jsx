import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  FileText,
  Settings,
  BarChart3,
  User,
  LogOut,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const dropdownRef = useRef(null);

  // Check if we're on a dashboard page
  const isDashboardPage =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/dashboard/analytics") ||
    location.pathname === "/dashboard/settings" ||
    location.pathname === "/create" ||
    location.pathname.startsWith("/edit");

  const dashboardNavItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/dashboard/posts", label: "Posts", icon: FileText },
    { path: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
    { path: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  return (
    <header
      style={{
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div className="container">
        <div
          className="flex items-center justify-between"
          style={{ height: "64px" }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "var(--black)",
              textDecoration: "none",
            }}
          >
            Blogio
          </Link>

          {/* Desktop Navigation */}
          <nav className="flex items-center gap-8 hidden-mobile">
            {isAuthenticated && isDashboardPage ? (
              // Dashboard Navigation
              <>
                {dashboardNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      style={{
                        color: isActive ? "var(--black)" : "var(--gray-600)",
                        fontSize: "14px",
                        fontWeight: isActive ? "600" : "500",
                        textDecoration: "none",
                        transition: "all 0.15s ease",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        background: isActive ? "var(--gray-50)" : "transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.target.style.color = "var(--black)";
                          e.target.style.background = "var(--gray-50)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.target.style.color = "var(--gray-600)";
                          e.target.style.background = "transparent";
                        }
                      }}
                    >
                      <Icon size={16} />
                      {item.label}
                    </Link>
                  );
                })}
              </>
            ) : (
              // Public Navigation
              <>
                <Link
                  to="/"
                  style={{
                    color:
                      location.pathname === "/"
                        ? "var(--black)"
                        : "var(--gray-600)",
                    fontSize: "14px",
                    fontWeight: location.pathname === "/" ? "600" : "500",
                    textDecoration: "none",
                    transition: "color 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "var(--black)")}
                  onMouseLeave={(e) =>
                    (e.target.style.color =
                      location.pathname === "/"
                        ? "var(--black)"
                        : "var(--gray-600)")
                  }
                >
                  Home
                </Link>
                <Link
                  to="/posts"
                  style={{
                    color:
                      location.pathname === "/posts"
                        ? "var(--black)"
                        : "var(--gray-600)",
                    fontSize: "14px",
                    fontWeight: location.pathname === "/posts" ? "600" : "500",
                    textDecoration: "none",
                    transition: "color 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "var(--black)")}
                  onMouseLeave={(e) =>
                    (e.target.style.color =
                      location.pathname === "/posts"
                        ? "var(--black)"
                        : "var(--gray-600)")
                  }
                >
                  Articles
                </Link>
                <Link
                  to="/about"
                  style={{
                    color:
                      location.pathname === "/about"
                        ? "var(--black)"
                        : "var(--gray-600)",
                    fontSize: "14px",
                    fontWeight: location.pathname === "/about" ? "600" : "500",
                    textDecoration: "none",
                    transition: "color 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "var(--black)")}
                  onMouseLeave={(e) =>
                    (e.target.style.color =
                      location.pathname === "/about"
                        ? "var(--black)"
                        : "var(--gray-600)")
                  }
                >
                  About
                </Link>
              </>
            )}

            <div
              style={{
                width: "1px",
                height: "20px",
                background: "var(--gray-200)",
              }}
            ></div>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {!isDashboardPage && (
                  <Link to="/create" className="btn btn-primary">
                    Write
                  </Link>
                )}

                {/* Profile Dropdown */}
                <div ref={dropdownRef} style={{ position: "relative" }}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "none",
                      background: profileDropdownOpen
                        ? "var(--gray-50)"
                        : "transparent",
                      color: "var(--gray-700)",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      outline: "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!profileDropdownOpen) {
                        e.target.style.background = "var(--gray-700)";
                        e.target.style.color = "var(--white)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!profileDropdownOpen) {
                        e.target.style.background = "transparent";
                        e.target.style.color = "var(--black)";
                      }
                    }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: "var(--black)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      {user?.full_name
                        ? user.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : user?.username?.substring(0, 2).toUpperCase() || "U"}
                    </div>
                    <span>{user?.full_name || user?.username || "User"}</span>
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        right: "0",
                        marginTop: "8px",
                        width: "200px",
                        background: "var(--white)",
                        borderRadius: "12px",
                        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
                        border: "1px solid var(--gray-100)",
                        overflow: "hidden",
                        zIndex: 1000,
                      }}
                    >
                      <div
                        style={{
                          padding: "12px 16px",
                          borderBottom: "1px solid var(--gray-100)",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "var(--black)",
                          }}
                        >
                          {user?.full_name || user?.username || "User"}
                        </div>
                        <div
                          style={{ fontSize: "12px", color: "var(--gray-600)" }}
                        >
                          {user?.email || "user@example.com"}
                        </div>
                      </div>

                      <div style={{ padding: "8px 0" }}>
                        {!isDashboardPage && (
                          <Link
                            to="/dashboard"
                            onClick={() => setProfileDropdownOpen(false)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              padding: "12px 16px",
                              color: "var(--gray-700)",
                              textDecoration: "none",
                              fontSize: "14px",
                              transition: "background 0.15s ease",
                            }}
                            onMouseEnter={(e) =>
                              (e.target.style.background = "var(--gray-50)")
                            }
                            onMouseLeave={(e) =>
                              (e.target.style.background = "transparent")
                            }
                          >
                            <LayoutDashboard size={16} />
                            Dashboard
                          </Link>
                        )}

                        <Link
                          to="/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "12px 16px",
                            color: "var(--gray-700)",
                            textDecoration: "none",
                            fontSize: "14px",
                            transition: "background 0.15s ease",
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.background = "var(--gray-50)")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.background = "transparent")
                          }
                        >
                          <User size={16} />
                          Profile
                        </Link>

                        <div
                          style={{
                            height: "1px",
                            background: "var(--gray-100)",
                            margin: "8px 0",
                          }}
                        ></div>

                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            logout();
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "12px 16px",
                            width: "100%",
                            border: "none",
                            background: "transparent",
                            color: "var(--red)",
                            fontSize: "14px",
                            cursor: "pointer",
                            transition: "background 0.15s ease",
                            outline: "none",
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.background = "var(--gray-50)")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.background = "transparent")
                          }
                        >
                          <LogOut size={16} />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="btn btn-ghost">
                  Sign in
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-ghost hidden-desktop"
            style={{ padding: "8px" }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div
            className="hidden-desktop"
            style={{
              paddingTop: "16px",
              paddingBottom: "16px",
            }}
          >
            <nav className="flex flex-col gap-4">
              {isAuthenticated && isDashboardPage ? (
                // Dashboard Mobile Navigation
                <>
                  {dashboardNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          color: isActive ? "var(--black)" : "var(--gray-600)",
                          fontSize: "14px",
                          fontWeight: isActive ? "600" : "500",
                          padding: "12px 16px",
                          borderRadius: "8px",
                          background: isActive
                            ? "var(--gray-50)"
                            : "transparent",
                          textDecoration: "none",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <Icon size={16} />
                        {item.label}
                      </Link>
                    );
                  })}
                </>
              ) : (
                // Public Mobile Navigation
                <>
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      color:
                        location.pathname === "/"
                          ? "var(--black)"
                          : "var(--gray-600)",
                      fontSize: "14px",
                      fontWeight: location.pathname === "/" ? "600" : "500",
                      padding: "8px 0",
                      textDecoration: "none",
                    }}
                  >
                    Home
                  </Link>
                  <Link
                    to="/posts"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      color:
                        location.pathname === "/posts"
                          ? "var(--black)"
                          : "var(--gray-600)",
                      fontSize: "14px",
                      fontWeight:
                        location.pathname === "/posts" ? "600" : "500",
                      padding: "8px 0",
                      textDecoration: "none",
                    }}
                  >
                    Articles
                  </Link>
                  <Link
                    to="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      color:
                        location.pathname === "/about"
                          ? "var(--black)"
                          : "var(--gray-600)",
                      fontSize: "14px",
                      fontWeight:
                        location.pathname === "/about" ? "600" : "500",
                      padding: "8px 0",
                      textDecoration: "none",
                    }}
                  >
                    About
                  </Link>
                </>
              )}

              <div
                style={{
                  height: "1px",
                  background: "var(--gray-100)",
                  margin: "8px 0",
                }}
              ></div>

              {isAuthenticated ? (
                <div className="flex flex-col gap-2">
                  {!isDashboardPage && (
                    <Link
                      to="/create"
                      className="btn btn-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Write
                    </Link>
                  )}

                  {/* User Info */}
                  <div
                    style={{
                      padding: "12px 16px",
                      background: "var(--gray-50)",
                      borderRadius: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "var(--black)",
                      }}
                    >
                      {user?.full_name || user?.username || "User"}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--gray-600)" }}>
                      {user?.email || "user@example.com"}
                    </div>
                  </div>

                  {!isDashboardPage && (
                    <Link
                      to="/dashboard"
                      className="btn btn-secondary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Link>
                  )}

                  <Link
                    to="/profile"
                    className="btn btn-secondary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User size={16} />
                    Profile
                  </Link>

                  <button
                    className="btn btn-secondary"
                    style={{ color: "var(--red)", borderColor: "var(--red)" }}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                  >
                    <LogOut size={16} />
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    className="btn btn-secondary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
