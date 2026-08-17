<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { setAuthState } from '@/store/auth';
import axios from 'axios';

const router = useRouter();
const form = ref({
  email: '',
  password: '',
});
const errorMessage = ref('');
const isSubmitting = ref(false);

const submitForm = async () => {
  errorMessage.value = '';
  isSubmitting.value = true;

  try {
    const response = await axios.post('/api/auth/login', form.value, {
      withCredentials: true,
    });
    setAuthState(response.data.user);
    router.push('/');
  } catch (error) {
    errorMessage.value = error?.response?.data?.message || 'Login failed';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <section
    class="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-12"
  >
    <div
      class="w-full max-w-md rounded-xl bg-white shadow-lg border border-slate-200 p-8"
    >
      <div class="mb-6 text-center">
        <h1 class="text-3xl font-bold text-slate-800">Login</h1>
        <p class="mt-2 text-sm text-slate-500">Welcome back</p>
      </div>

      <form @submit.prevent="submitForm" class="space-y-5">
        <div>
          <label
            class="mb-1 block text-sm font-medium text-slate-700"
            for="email"
            >Email</label
          >
          <input
            id="email"
            v-model="form.email"
            name="email"
            type="email"
            required
            class="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-green-500 focus:outline-none"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            class="mb-1 block text-sm font-medium text-slate-700"
            for="password"
            >Password</label
          >
          <input
            id="password"
            v-model="form.password"
            name="password"
            type="password"
            required
            class="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-green-500 focus:outline-none"
            placeholder="Enter your password"
          />
        </div>

        <p
          v-if="errorMessage"
          class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600"
        >
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full rounded-md bg-green-700 px-4 py-2.5 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {{ isSubmitting ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-slate-600">
        Not a member yet?
        <RouterLink
          to="/register"
          class="ml-1 font-semibold text-green-700 hover:text-green-800"
        >
          Register
        </RouterLink>
      </p>
    </div>
  </section>
</template>
