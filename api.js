// API handling for CineWatch Custom Backend
const API_URL = 'https://cinewatch-maaa.onrender.com/api';

window.CW_API = {
  getToken() {
    return localStorage.getItem('cw_token');
  },

  setToken(token) {
    if (token) {
      localStorage.setItem('cw_token', token);
    } else {
      localStorage.removeItem('cw_token');
    }
  },

  async request(endpoint, method = 'GET', body = null) {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
      method,
      headers
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, options);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'API Request Failed');
      }
      
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async signUp(name, email, password) {
    const { data, error } = await this.request('/signup', 'POST', { name, email, password });
    if (data && data.token) {
      this.setToken(data.token);
    }
    return { user: data ? data.user : null, error };
  },

  async signIn(username, password) {
    const { data, error } = await this.request('/login', 'POST', { username, password });
    if (data && data.token) {
      this.setToken(data.token);
    }
    return { user: data ? data.user : null, error };
  },

  async updateAvatar(dataUrl) {
    if (!this.getToken()) return;
    return await this.request('/update-profile', 'POST', { avatar: dataUrl });
  },

  async updateProfile(data) {
    if (!this.getToken()) return;
    return await this.request('/update-profile', 'POST', { name: data.displayName });
  },

  async updateUserPassword(oldPassword, newPassword) {
    if (!this.getToken()) return { error: 'Not logged in' };
    return await this.request('/update-password', 'POST', { oldPassword, newPassword });
  },

  async resetPassword(username) {
    return await this.request('/reset-password', 'POST', { username });
  },

  signOut() {
    this.setToken(null);
    window.dispatchEvent(new CustomEvent('cw:authChanged', { detail: { user: null, cloudData: null } }));
  },

  async getCurrentUser() {
    if (!this.getToken()) return null;
    const { data, error } = await this.request('/me', 'GET');
    if (error) {
      this.setToken(null);
      return null;
    }
    return data;
  },

  async syncData(favorites, continueWatching) {
    if (!this.getToken()) return { error: 'Not logged in' };
    return await this.request('/sync', 'POST', { favorites, continueWatching });
  }
};

// Initialize Auth State on load
document.addEventListener('DOMContentLoaded', async () => {
  let user = null;
  let cloudData = null;
  if (window.CW_API.getToken()) {
    const data = await window.CW_API.getCurrentUser();
    if (data) {
      user = { id: data.id, name: data.name, username: data.username, email: data.email, avatar: data.avatar, createdAt: data.createdAt };
      cloudData = { favorites: data.favorites, continueWatching: data.continueWatching };
    }
  }
  window.dispatchEvent(new CustomEvent('cw:authChanged', { detail: { user, cloudData } }));
});
