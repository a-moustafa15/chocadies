/**
 * Applicant Store (Pinia)
 * * Manages the global state for the application, including:
 * 1. Authentication tokens and user status.
 * 2. Applicant lists and detailed views for HR.
 * 3. Global UI states (loading, errors, submission success).
 */
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useApplicantStore = defineStore('applicant', () => {
  
  // --- STATE (Reactive Refs) ---
  
  const applicants = ref([]);
  const currentApplicant = ref(null);
  
  // Initialize tokens from localStorage to persist login across page refreshes
  const token = ref(localStorage.getItem('access_token') || null);
  const refreshToken = ref(localStorage.getItem('refresh_token') || null);
  
  const isLoading = ref(false);
  const error = ref(null);
  
  // Tracks if a user just submitted an application (used for Success Page redirects)
  const hasApplyJustSubmitted = ref(false);

  // --- GETTERS (Computed Values) ---

  /** @returns {boolean} True if a valid access token exists */
  const isAuthenticated = computed(() => !!token.value);

  /**
   * Helper to find an applicant from the existing list without a network call.
   * @param {String|Number} id 
   */
  const getApplicantById = (id) => {
    return applicants.value.find((a) => a.id === String(id));
  };

  // --- ACTIONS (Functions to Modify State) ---

  /**
   * Sets the status of a recent application submission.
   * @param {boolean} status 
   */
  function setHasApplyJustSubmitted(status) {
    hasApplyJustSubmitted.value = status;
  }

  /**
   * Updates JWT tokens in both the store state and Browser Storage.
   * @param {String} access - The new Access Token
   * @param {String} refresh - The new Refresh Token
   */
  function setTokens(access, refresh) {
    token.value = access;
    if (access) {
      localStorage.setItem('access_token', access);
    } else {
      localStorage.removeItem('access_token');
    }

    refreshToken.value = refresh;
    if (refresh) {
      localStorage.setItem('refresh_token', refresh);
    } else {
      localStorage.removeItem('refresh_token');
    }
  }

  function setApplicants(list) {
    applicants.value = list;
  }

  function setCurrentApplicant(applicant) {
    currentApplicant.value = applicant;
  }

  /**
   * Updates a specific applicant in the local list.
   * Used after an HR update (PATCH) to keep the UI in sync without a full reload.
   */
  function updateApplicantInList(updatedApplicant) {
    const index = applicants.value.findIndex(a => a.id === updatedApplicant.id);
    if (index !== -1) {
      applicants.value[index] = updatedApplicant;
    }
    // Synchronize the current detail view if the user is looking at that specific applicant
    if (currentApplicant.value?.id === updatedApplicant.id) {
      currentApplicant.value = updatedApplicant;
    }
  }

  function setLoading(status) {
    isLoading.value = status;
  }

  function setError(err) {
    error.value = err;
  }

  function clearError() {
    error.value = null;
  }

  /**
   * Wipes all user data and credentials.
   * Used during logout or when a session expires.
   */
  function clearAuth() {
    token.value = null;
    refreshToken.value = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    currentApplicant.value = null;
    applicants.value = [];
  }

  // --- EXPOSE EVERYTHING ---
  return {
    // State
    applicants,
    currentApplicant,
    token,
    refreshToken,
    isLoading,
    error,
    
    // Getters
    isAuthenticated,
    getApplicantById,
    hasApplyJustSubmitted,
    
    // Actions
    setTokens,
    setApplicants,
    setCurrentApplicant,
    updateApplicantInList,
    setLoading,
    setError,
    clearError,
    clearAuth,
    setHasApplyJustSubmitted
  };
});