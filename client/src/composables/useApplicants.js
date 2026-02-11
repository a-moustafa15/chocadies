/**
 * useApplicants Composable
 * * A central logic hub for applicant-related operations. 
 * This composable bridges the gap between the API service layer and the Pinia store.
 */
import { useApplicantStore } from '@/stores/applicantStore';
import api from '@/services/api'; 
import { useRouter } from 'vue-router';
import { computed } from 'vue';

export function useApplicants() {
  const store = useApplicantStore();
  const router = useRouter();

  // --- AUTHENTICATION ACTIONS ---

  /**
   * authenticates a user with credentials.
   * Handles JWT token storage and complex backend error parsing.
   * @param {Object} credentials - { username, password }
   * @returns {Promise<boolean>} Success status
   */
  const login = async (credentials) => {
    store.setLoading(true);
    store.clearError();
    
    try {
      const response = await api.login(credentials);
      const accessToken = response.data.access;
      const refreshToken = response.data.refresh;
      
      if (!accessToken) throw new Error("No access token received");

      store.setTokens(accessToken, refreshToken);
      return true;
    } catch (err) {
      console.error("Login Failed:", err);
      
      // Error Parsing Logic: Extracts readable messages from backend responses
      if (err.response && err.response.data) {
          if (err.response.data.detail) {
              store.setError(err.response.data.detail);
          } else if (typeof err.response.data === 'object') {
              const firstKey = Object.keys(err.response.data)[0];
              const firstMsg = err.response.data[firstKey];
              const msgText = Array.isArray(firstMsg) ? firstMsg[0] : firstMsg;
              store.setError(`${firstKey}: ${msgText}`);
          } else {
              store.setError('Invalid credentials.');
          }
      } else {
          store.setError('Network error. Please try again.');
      }
      return false;
    } finally {
      store.setLoading(false);
    }
  };

  /**
   * Logs out the user.
   * Attempts to blacklist the refresh token on the server before clearing local state.
   */
  const logout = async () => {
    store.setLoading(true);
    try {
      const refresh = store.refreshToken;
      if (refresh) {
        await api.logout(refresh);
      }
    } catch (err) {
      console.error("Logout API failed (token might already be invalid)", err);
    } finally {
      // Ensure local state is wiped even if the API call fails
      store.clearAuth();
      store.setLoading(false);
      router.replace('/login');
    }
  };

  // --- DATA FETCHING ACTIONS ---

  /**
   * Fetches the full list of applicants.
   * Triggered usually from the Dashboard view.
   */
  const fetchApplicants = async () => {
    store.setLoading(true);
    try {
      const response = await api.getApplicants();
      store.setApplicants(response.data);
    } catch (err) {
      store.setError('Failed to load applicants.');
      // Auto-logout if unauthorized (expired token)
      if (err.response?.status === 401) logout();
    } finally {
      store.setLoading(false);
    }
  };

  /**
   * Fetches a single applicant by ID.
   * Uses a "Cache-First" strategy by checking the Pinia store before calling API.
   * @param {Number|String} id 
   */
  const fetchApplicantById = async (id) => {
    store.setLoading(true);
    const cached = store.getApplicantById(id);
    if (cached) {
      store.setCurrentApplicant(cached);
      store.setLoading(false);
      return; 
    }

    try {
      const response = await api.getApplicant(id);
      store.setCurrentApplicant(response.data);
    } catch (err) {
      store.setError('Failed to load applicant details.');
    } finally {
      store.setLoading(false);
    }
  };

  // --- MANAGEMENT ACTIONS ---

  /**
   * Updates an applicant's status or notes (HR Function).
   * @param {Number|String} id 
   * @param {Object} updateData - e.g., { status: 'rejected', hr_notes: '...' }
   */
  const saveApplicant = async (id, updateData) => {
    store.setLoading(true);
    try {
      const response = await api.updateApplicant(id, updateData);
      store.updateApplicantInList(response.data);
      return true;
    } catch (err) {
      console.error(err);
      store.setError('Failed to save changes.');
      return false;
    } finally {
      store.setLoading(false);
    }
  };

  /**
   * Submits a new application.
   * Includes detailed error parsing for field-level validation (e.g., email errors).
   * @param {FormData|Object} formData 
   */
  const submitApplication = async (formData) => {
    store.setLoading(true);
    store.clearError();
    
    try {
      await api.apply(formData); 
      return true;
    } catch (err) {
      console.error("Application Failed:", err);
      
      if (err.response && err.response.data) {
          if (err.response.data.detail) {
              store.setError(err.response.data.detail);
          } else if (typeof err.response.data === 'object') {
              const keys = Object.keys(err.response.data);
              if (keys.length > 0) {
                  const field = keys[0];
                  const message = err.response.data[field];
                  const errorText = Array.isArray(message) ? message[0] : message;
                  
                  // Pretty-print field name: "resume_file" -> "Resume file"
                  const fieldName = field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ');
                  store.setError(`${fieldName}: ${errorText}`);
              } else {
                  store.setError('Invalid data provided.');
              }
          } else {
              store.setError('An error occurred. Please check your inputs.');
          }
      } else {
          store.setError('Network error. Unable to reach the server.');
      }
      return false;
    } finally {
      store.setLoading(false);
    }
  };

  return {
    // Reactive State
    applicants: store.applicants,
    currentApplicant: store.currentApplicant,
    isLoading: store.isLoading,
    error: computed(() => store.error),
    isAuthenticated: store.isAuthenticated,
    
    // Exported Methods
    login,
    logout,
    fetchApplicants,
    fetchApplicantById,
    saveApplicant,
    submitApplication
  };
}