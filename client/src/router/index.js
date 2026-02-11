/**
 * Application Router Configuration
 * Handles route mapping, history modes, and authentication guards.
 */
import { createRouter, createWebHistory } from '@ionic/vue-router';

// View Imports
import ApplyPage from '../views/ApplyPage.vue';
import SuccessPage from '../views/SuccessPage.vue';
import LoginPage from '../views/LoginPage.vue';
import DashboardPage from '../views/DashboardPage.vue';
import DetailPage from '../views/DetailPage.vue';

/**
 * Route Definitions
 * 'meta: { requiresAuth: true }' is used to identify protected routes.
 */
const routes = [
  {
    path: '/',
    redirect: '/apply' // Initial entry point redirects to the application form
  },
  {
    path: '/apply',
    name: 'Apply',
    component: ApplyPage
  },
  {
    path: '/success',
    name: 'Success',
    component: SuccessPage
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardPage,
    meta: { requiresAuth: true } // Protected: HR/Staff access only
  },
  {
    path: '/detail/:id',
    name: 'Detail',
    component: DetailPage,
    meta: { requiresAuth: true } // Protected: HR/Staff access only
  }
];

const router = createRouter({
  // Use Web History for clean URLs (no # in the address bar)
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

/**
 * Global Navigation Guard
 * Checks for an access token before allowing entry to protected routes.
 * * @param to - The target route object being navigated to
 * @param from - The current route being navigated from
 * @param next - The function to resolve the hook
 */
router.beforeEach((to, from, next) => {
  // Check if user is logged in via localStorage
  const isAuthenticated = localStorage.getItem('access_token');
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirect unauthorized users to login page
    next('/login');
  } else {
    // Proceed as normal
    next();
  }
});

export default router;