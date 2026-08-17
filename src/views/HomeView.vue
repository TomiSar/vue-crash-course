<script setup>
import Hero from '@/components/Hero.vue';
import HomeCards from '@/components/HomeCards.vue';
import JobListings from '@/components/JobListings.vue';
import { authState } from '@/store/auth';
</script>

<template>
  <Hero />
  <div
    v-if="!authState.isAuthenticated"
    class="mx-auto mt-6 max-w-4xl rounded-lg border border-green-200 bg-green-50 p-6 text-center shadow-sm"
  >
    <h2 class="text-2xl font-bold">
      Login or Register to see all open positions
    </h2>
    <div class="mt-4 flex justify-center gap-4">
      <RouterLink
        to="/login"
        class="rounded-md bg-green-700 px-4 py-2 text-white hover:bg-green-800"
      >
        Login
      </RouterLink>
      <RouterLink
        to="/register"
        class="rounded-md border border-green-700 px-4 py-2 text-green-700 hover:bg-green-100"
      >
        Register
      </RouterLink>
    </div>
    <div
      class="text-center text-gray-500 py-20 bg-white rounded-lg shadow-md mt-8"
    >
      <i class="pi pi-briefcase text-5xl mb-4 text-gray-300"></i>
      <h3 class="text-2xl font-bold mb-2"></h3>
      <h4>Open opportunities available after login or register</h4>
    </div>
  </div>
  <template v-else>
    <HomeCards v-if="authState.isAdmin" />
    <JobListings :jobLimit="3" :showAllJobsButton="true" />
  </template>
</template>
