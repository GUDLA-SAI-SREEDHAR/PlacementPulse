/**
 * PlacementPulse API Client Layer
 * Connects Frontend PortalContext & Store to backend REST API service
 *
 * Configure production API URL by setting window.__PLACEMENT_PULSE_API_URL__
 * before this script loads, or it will auto-detect based on environment.
 */

const API_BASE_URL = (() => {
  // 1. Explicit override (set in index.html for production)
  if (typeof window !== 'undefined' && window.__PLACEMENT_PULSE_API_URL__) {
    return window.__PLACEMENT_PULSE_API_URL__;
  }
  // 2. Local development
  if (typeof window !== 'undefined' && window.location &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://127.0.0.1:8000/api';
  }
  // 3. Production: same-origin (single-service deploy) or file:// fallback
  if (typeof window !== 'undefined' && window.location &&
      !window.location.origin.startsWith('file:')) {
    return `${window.location.origin}/api`;
  }
  // 4. Fallback for file:// protocol
  return 'http://127.0.0.1:8000/api';
})();

class ApiClient {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
    try {
      this.token = localStorage.getItem('vpc_jwt_token') || null;
    } catch (e) {
      this.token = null;
    }
  }

  setToken(token) {
    this.token = token;
    try {
      if (token) {
        localStorage.setItem('vpc_jwt_token', token);
      } else {
        localStorage.removeItem('vpc_jwt_token');
      }
    } catch (e) {
      console.warn('Could not save JWT token to localStorage');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }));
        throw new Error(errorData.detail || errorData.message || `HTTP Error ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.warn(`[API Client] Network or endpoint failure on ${endpoint}:`, err.message);
      throw err;
    }
  }

  // --- Health Check ---
  async checkHealth() {
    return this.request('/health');
  }

  // --- Auth ---
  async login(email, password, role) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role })
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  // --- Students ---
  async getStudentProfile() {
    return this.request('/students/profile');
  }

  async updateStudentProfile(profileUpdates) {
    return this.request('/students/profile', {
      method: 'PUT',
      body: JSON.stringify(profileUpdates)
    });
  }

  async uploadResume(content, fileName = 'Uploaded_Resume.pdf') {
    return this.request('/students/resume', {
      method: 'POST',
      body: JSON.stringify({ content, fileName })
    });
  }

  async listStudents() {
    return this.request('/students');
  }

  async verifyStudent(studentId, isVerified = true) {
    return this.request(`/students/${studentId}/verify?is_verified=${isVerified}`, {
      method: 'PATCH'
    });
  }

  // --- Jobs ---
  async listJobs(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = `/jobs${query ? `?${query}` : ''}`;
    return this.request(endpoint);
  }

  async postJob(jobData) {
    return this.request('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData)
    });
  }

  async approveJob(jobId, status = 'APPROVED') {
    return this.request(`/jobs/${jobId}/approve`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }

  // --- Applications ---
  async listApplications(studentId = null, jobId = null) {
    const params = {};
    if (studentId) params.student_id = studentId;
    if (jobId) params.job_id = jobId;
    const query = new URLSearchParams(params).toString();
    return this.request(`/applications${query ? `?${query}` : ''}`);
  }

  async applyForJob(jobId) {
    return this.request('/applications', {
      method: 'POST',
      body: JSON.stringify({ jobId })
    });
  }

  async updateApplicationStatus(appId, status, interviewDetails = null) {
    return this.request(`/applications/${appId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, interviewDetails })
    });
  }

  // --- ATS ---
  async analyzeATS(resumeText, targetRoleId = 'fullstack') {
    return this.request('/ats/analyze', {
      method: 'POST',
      body: JSON.stringify({ resumeText, targetRoleId })
    });
  }

  async getTargetRoles() {
    return this.request('/ats/target-roles');
  }

  // --- Interview Experiences ---
  async listExperiences() {
    return this.request('/experiences');
  }

  async addExperience(expData) {
    return this.request('/experiences', {
      method: 'POST',
      body: JSON.stringify(expData)
    });
  }

  // --- Notifications ---
  async getNotifications() {
    return this.request('/notifications');
  }

  async markAllNotificationsRead() {
    return this.request('/notifications/read-all', {
      method: 'PATCH'
    });
  }

  // --- Analytics ---
  async getAnalyticsDashboard() {
    return this.request('/analytics/dashboard');
  }
}

export const api = new ApiClient();
