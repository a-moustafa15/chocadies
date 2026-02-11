/**
 * API Service Layer
 * * Provides a clean interface for all network requests to the backend.
 * Uses Axios for HTTP communication and handles JWT Bearer authentication.
 */
import axios from 'axios';

// Base URL configuration using Environment Variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';

/**
 * Authorization Helper
 * Retrieves the JWT access token from localStorage and formats the Bearer header.
 * @returns {Object} Headers object containing Authorization or empty.
 */
const getAuthHeader = () => {
  const token = localStorage.getItem('access_token'); 
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default {
  
  /**
   * Public: Submit a new job application.
   * Uses multipart/form-data to support file uploads (resumes).
   * @param {FormData} formData - Data containing applicant details and files.
   */
  apply(formData) {
    return axios.post(`${API_URL}applicants/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  /**
   * Public: Authenticate user.
   * Calls the SimpleJWT token endpoint.
   * @param {Object} credentials - { username, password }
   */
  login(credentials) {
    return axios.post(`${API_URL}token/`, credentials);
  },

  /**
   * Public: Blacklist a refresh token.
   * Tells the server to invalidate the token during logout.
   * @param {String} refreshToken 
   */
  logout(refreshToken) {
    return axios.post(`${API_URL}logout/`, {
      refresh: refreshToken
    }, { headers: getAuthHeader() });
  },

  // --- PROTECTED ROUTES (Requires Staff/HR Permissions) ---

  /**
   * Protected: Fetch all applicants.
   */
  getApplicants() {
    return axios.get(`${API_URL}applicants/`, { headers: getAuthHeader() });
  },

  /**
   * Protected: Fetch a single applicant's full details.
   * @param {Number|String} id 
   */
  getApplicant(id) {
    return axios.get(`${API_URL}applicants/${id}/`, { headers: getAuthHeader() });
  },

  /**
   * Protected: Update an applicant (e.g., status, internal notes).
   * Uses PATCH for partial updates.
   * @param {Number|String} id 
   * @param {Object} data - The updated fields.
   */
  updateApplicant(id, data) {
    return axios.patch(`${API_URL}applicants/${id}/`, data, { headers: getAuthHeader() });
  }
};