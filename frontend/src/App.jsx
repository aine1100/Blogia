import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
    <Router>
      <div style={{ minHeight: "100vh" }}>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/about" element={<About />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/edit/:id" element={<EditPost />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/posts" element={<DashboardPosts />} />
            <Route path="/dashboard/post/:id" element={<DashboardPostDetail/>} />
            <Route
              path="/dashboard/subscribers"
              element={<DashboardSubscribers />}
            />
            <Route path="/dashboard/settings" element={<DashboardSettings />} />
            <Route path="/dashboard/analytics" element={<Analytics />} />
            <Route path="/post/:id/analytics" element={<Analytics />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
