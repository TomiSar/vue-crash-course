<script setup>
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';
import logo from '@/assets/img/logo.png';
import { authState, logoutUser } from '@/store/auth';

const route = useRoute();
const router = useRouter();

const isActiveLink = (routePath) => route.path === routePath;
const userName = computed(() => authState.user?.name || 'User');

const handleLogout = async () => {
  await logoutUser();
  router.push('/');
};
</script>

<template>
  <nav class="border-b border-green-500 bg-green-700">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="flex h-20 items-center justify-between">
        <div
          class="flex flex-1 items-center justify-center md:items-stretch md:justify-start"
        >
          <RouterLink class="mr-4 flex flex-shrink-0 items-center" to="/">
            <img class="h-10 w-auto" :src="logo" alt="Vue Jobs" />
            <span class="ml-2 hidden text-2xl font-bold text-white md:block"
              >Vue Jobs</span
            >
          </RouterLink>

          <div class="md:ml-auto">
            <div class="flex flex-wrap items-center gap-2">
              <template v-if="authState.isAuthenticated">
                <RouterLink
                  to="/profile"
                  :class="[
                    isActiveLink('/profile')
                      ? 'bg-green-900'
                      : 'hover:bg-gray-900 hover:text-white',
                    'rounded-md px-3 py-2 text-white',
                  ]"
                >
                  {{ userName }}
                </RouterLink>
                <RouterLink
                  :class="[
                    isActiveLink('/')
                      ? 'bg-green-900'
                      : 'hover:bg-gray-900 hover:text-white',
                    'rounded-md px-3 py-2 text-white',
                  ]"
                  to="/"
                  data-testid="home-link"
                >
                  Home
                </RouterLink>

                <RouterLink
                  :class="[
                    isActiveLink('/jobs')
                      ? 'bg-green-900'
                      : 'hover:bg-gray-900 hover:text-white',
                    'rounded-md px-3 py-2 text-white',
                  ]"
                  to="/jobs"
                  data-testid="jobs-link"
                >
                  Jobs
                </RouterLink>
              </template>
              <RouterLink
                v-if="authState.isAuthenticated && authState.isAdmin"
                :class="[
                  isActiveLink('/jobs/add')
                    ? 'bg-green-900'
                    : 'hover:bg-gray-900 hover:text-white',
                  'rounded-md px-3 py-2 text-white',
                ]"
                to="/jobs/add"
                data-testid="add-job-link"
              >
                Add Job
              </RouterLink>
              <template v-if="authState.isAuthenticated">
                <button
                  type="button"
                  @click="handleLogout"
                  class="rounded-md border border-white/40 bg-transparent px-3 py-2 text-white hover:bg-gray-900"
                >
                  Logout
                </button>
              </template>

              <template v-else>
                <RouterLink
                  :class="[
                    isActiveLink('/login')
                      ? 'bg-green-900'
                      : 'hover:bg-gray-900 hover:text-white',
                    'rounded-md px-3 py-2 text-white',
                  ]"
                  to="/login"
                  data-testid="login-link"
                >
                  Login
                </RouterLink>
                <RouterLink
                  :class="[
                    isActiveLink('/register')
                      ? 'bg-green-900'
                      : 'hover:bg-gray-900 hover:text-white',
                    'rounded-md px-3 py-2 text-white',
                  ]"
                  to="/register"
                  data-testid="register-link"
                >
                  Register
                </RouterLink>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
