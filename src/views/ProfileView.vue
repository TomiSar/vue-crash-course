<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { authState, setAuthState } from '@/store/auth';

const router = useRouter();
const form = ref({
  name: '',
  lastName: '',
  email: '',
  location: '',
});
const isSaving = ref(false);
const errorMessage = ref('');

const loadProfile = async () => {
  try {
    const response = await axios.get('/api/auth/current-user', {
      withCredentials: true,
    });
    const user = response.data.user;
    form.value = {
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      location: user.location,
    };
    setAuthState(user);
  } catch (error) {
    router.push('/login');
  }
};

const updateProfile = async () => {
  isSaving.value = true;
  errorMessage.value = '';

  try {
    const response = await axios.patch('/api/auth/update-user', form.value, {
      withCredentials: true,
    });
    setAuthState(response.data.user);
    router.push('/');
  } catch (error) {
    errorMessage.value =
      error?.response?.data?.message || 'Failed to update profile';
  } finally {
    isSaving.value = false;
  }
};

onMounted(loadProfile);
</script>

<template>
  <section class="min-h-screen bg-slate-100 p-6">
    <div class="mx-auto max-w-xl rounded-lg bg-white p-8 shadow-md">
      <h1 class="mb-6 text-3xl font-bold text-slate-800">Profile</h1>

      <form @submit.prevent="updateProfile" class="space-y-5">
        <div>
          <label
            class="mb-1 block text-sm font-medium text-slate-700"
            for="name"
            >Name</label
          >
          <input
            id="name"
            v-model="form.name"
            type="text"
            class="w-full rounded border px-3 py-2"
            required
          />
        </div>

        <div>
          <label
            class="mb-1 block text-sm font-medium text-slate-700"
            for="lastName"
            >Last Name</label
          >
          <input
            id="lastName"
            v-model="form.lastName"
            type="text"
            class="w-full rounded border px-3 py-2"
            required
          />
        </div>

        <div>
          <label
            class="mb-1 block text-sm font-medium text-slate-700"
            for="email"
            >Email</label
          >
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="w-full rounded border px-3 py-2"
            required
          />
        </div>

        <div>
          <label
            class="mb-1 block text-sm font-medium text-slate-700"
            for="location"
            >Location</label
          >
          <input
            id="location"
            v-model="form.location"
            type="text"
            class="w-full rounded border px-3 py-2"
            required
          />
        </div>

        <p
          v-if="errorMessage"
          class="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600"
        >
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          :disabled="isSaving"
          class="w-full rounded bg-green-700 px-4 py-2 text-white hover:bg-green-800 disabled:opacity-60"
        >
          {{ isSaving ? 'Saving...' : 'Save Profile' }}
        </button>
      </form>
    </div>
  </section>
</template>
