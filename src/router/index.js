import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import JobsView from '@/views/JobsView.vue';
import JobView from '@/views/JobView.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import AddJobView from '@/views/AddJobView.vue';
import EditJobView from '../views/EditJobView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import ProfileView from '../views/ProfileView.vue';
import { authState, checkAuth } from '@/store/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: '/jobs',
      name: 'jobs',
      component: JobsView,
    },
    {
      path: '/jobs/:id',
      name: 'job',
      component: JobView,
    },
    {
      path: '/jobs/add',
      name: 'add-job',
      component: AddJobView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/jobs/edit/:id',
      name: 'edit-job',
      component: EditJobView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  if (
    !authState.isLoading &&
    !authState.isAuthenticated &&
    to.meta.requiresAuth
  ) {
    return next('/login');
  }

  if (
    authState.isAuthenticated &&
    (to.name === 'login' || to.name === 'register')
  ) {
    return next('/');
  }

  if (to.meta.requiresAdmin && authState.isAdmin !== true) {
    return next('/');
  }

  if (authState.isLoading) {
    await checkAuth();
    if (to.meta.requiresAuth && !authState.isAuthenticated) {
      return next('/login');
    }
    if (to.meta.requiresAdmin && authState.isAdmin !== true) {
      return next('/');
    }
  }

  next();
});

export default router;
