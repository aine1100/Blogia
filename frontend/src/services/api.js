// Backend URL - now using HTTPS from Render
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://blogia-tizd.onrender.com';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  // Helper method to get headers
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Helper method to handle responses
  async handleResponse(response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
      throw new Error(error.detail || 'An error occurred');
    }
    return response.json();
  }

  // Set token for authenticated requests
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  // Auth endpoints
  async login(username, password) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      body: formData,
    });

    const data = await this.handleResponse(response);
    this.setToken(data.access_token);
    return data;
  }

  async register(userData) {
    const response = await fetch(`${this.baseURL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify(userData),
    });

    return this.handleResponse(response);
  }

  async logout() {
    this.setToken(null);
  }

  // User endpoints
  async getCurrentUser() {
    const response = await fetch(`${this.baseURL}/user/profile`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async updateProfile(profileData) {
    const response = await fetch(`${this.baseURL}/user/profile`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(profileData),
    });

    return this.handleResponse(response);
  }

  async changePassword(passwordData) {
    const response = await fetch(`${this.baseURL}/user/change-password`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(passwordData),
    });

    return this.handleResponse(response);
  }

  async getUserSettings() {
    const response = await fetch(`${this.baseURL}/user/settings`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async updateUserSettings(settingsData) {
    const response = await fetch(`${this.baseURL}/user/settings`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(settingsData),
    });

    return this.handleResponse(response);
  }

  // Dashboard endpoints
  async getDashboardStats() {
    const response = await fetch(`${this.baseURL}/dashboard/stats`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getRecentPosts(limit = 5) {
    const response = await fetch(`${this.baseURL}/dashboard/recent-posts?limit=${limit}`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getRecentComments(limit = 5) {
    const response = await fetch(`${this.baseURL}/dashboard/recent-comments?limit=${limit}`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getActivityFeed(limit = 10) {
    const response = await fetch(`${this.baseURL}/dashboard/activity-feed?limit=${limit}`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Analytics endpoints
  async getAnalyticsOverview(timeRange = '30d') {
    const response = await fetch(`${this.baseURL}/analytics/overview?time_range=${timeRange}`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getTopPosts(timeRange = '30d', limit = 10) {
    const response = await fetch(`${this.baseURL}/analytics/top-posts?time_range=${timeRange}&limit=${limit}`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getViewsOverTime(timeRange = '30d') {
    const response = await fetch(`${this.baseURL}/analytics/views-over-time?time_range=${timeRange}`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getAudienceGrowth(timeRange = '30d') {
    const response = await fetch(`${this.baseURL}/analytics/audience-growth?time_range=${timeRange}`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Posts endpoints
  async getPosts(skip = 0, limit = 10) {
    const response = await fetch(`${this.baseURL}/posts?skip=${skip}&limit=${limit}`);
    return this.handleResponse(response);
  }

  async getMyPosts(skip = 0, limit = 100) {
    const response = await fetch(`${this.baseURL}/posts/my-posts?skip=${skip}&limit=${limit}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async getPost(postId) {
    const response = await fetch(`${this.baseURL}/posts/${postId}`);
    return this.handleResponse(response);
  }

  async createPost(postData) {
    const response = await fetch(`${this.baseURL}/posts`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(postData),
    });

    return this.handleResponse(response);
  }

  async updatePost(postId, postData) {
    const response = await fetch(`${this.baseURL}/posts/${postId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(postData),
    });

    return this.handleResponse(response);
  }

  async deletePost(postId) {
    const response = await fetch(`${this.baseURL}/posts/${postId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Comments endpoints
  async getPostComments(postId, skip = 0, limit = 50) {
    const response = await fetch(`${this.baseURL}/comments/post/${postId}?skip=${skip}&limit=${limit}`);
    return this.handleResponse(response);
  }

  async createComment(commentData) {
    const response = await fetch(`${this.baseURL}/comments`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(commentData),
    });

    return this.handleResponse(response);
  }

  async updateComment(commentId, commentData) {
    const response = await fetch(`${this.baseURL}/comments/${commentId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(commentData),
    });

    return this.handleResponse(response);
  }

  async deleteComment(commentId) {
    const response = await fetch(`${this.baseURL}/comments/${commentId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Interactions endpoints
  async trackPostView(postId) {
    const response = await fetch(`${this.baseURL}/interactions/view`, {
      method: 'POST',
      headers: this.getHeaders(false), // Don't require auth for views
      body: JSON.stringify({ post_id: postId }),
    });

    return this.handleResponse(response);
  }

  async togglePostLike(postId) {
    const response = await fetch(`${this.baseURL}/interactions/like`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ post_id: postId }),
    });

    return this.handleResponse(response);
  }

  async trackPostShare(postId, platform) {
    const response = await fetch(`${this.baseURL}/interactions/share`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify({ post_id: postId, platform }),
    });

    return this.handleResponse(response);
  }

  async getPostStats(postId) {
    const response = await fetch(`${this.baseURL}/interactions/post/${postId}/stats`);
    return this.handleResponse(response);
  }

  async getUserPostInteractions(postId) {
    const response = await fetch(`${this.baseURL}/interactions/post/${postId}/user-interactions`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Subscribers endpoints
  async subscribe(email, fullName = '') {
    const response = await fetch(`${this.baseURL}/interactions/subscribe`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify({ email, full_name: fullName }),
    });

    return this.handleResponse(response);
  }

  async getSubscribers(skip = 0, limit = 50) {
    const response = await fetch(`${this.baseURL}/subscribers?skip=${skip}&limit=${limit}`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getSubscriberStats() {
    const response = await fetch(`${this.baseURL}/subscribers/stats`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;