import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import Home from "./pages/Home";
import Posts from "./pages/Posts";
import About from "./pages/About";
import PostDetail from "./pages/PostDetail";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import Analytics from "./pages/Analytics";
import Dashboard from "./pages/Dashboard";
import DashboardPosts from "./pages/DashboardPosts";
import DashboardSubscribers from "./pages/DashboardSubscribers";
import DashboardSettings from "./pages/DashboardSettings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardPostDetail from "./pages/DashboardPostDetail";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: "100vh" }}>
          <Header />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--white)',
                color: 'var(--black)',
                border: '1px solid var(--gray-200)',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: 'white',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: 'white',
                },
              },
            }}
          />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/posts" element={<Posts />} />
              <Route path="/about" element={<About />} />
              <Route path="/post/:id" element={<PostDetail />} />

              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/dashboard/posts" element={<ProtectedRoute><DashboardPosts /></ProtectedRoute>} />
              <Route path="/dashboard/post/:id" element={<ProtectedRoute><DashboardPostDetail/></ProtectedRoute>} />
              <Route
                path="/dashboard/subscribers"
                element={<ProtectedRoute><DashboardSubscribers /></ProtectedRoute>}
              />
              <Route path="/dashboard/settings" element={<ProtectedRoute><DashboardSettings /></ProtectedRoute>} />
              <Route path="/dashboard/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="/create" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
              <Route path="/edit/:id" element={<ProtectedRoute><EditPost /></ProtectedRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
