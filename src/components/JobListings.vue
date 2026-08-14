<script setup>
import { defineProps, reactive, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import JobListing from '@/components/JobListing.vue';
import { PulseLoader } from 'vue-spinner';
import { fetchJobs } from '@/api/jobs';

defineProps({
  limit: Number,
  showButton: {
    type: Boolean,
    default: false,
  },
});

const state = reactive({
  jobs: [],
  isLoading: true,
});

onMounted(async () => {
  state.isLoading = true;
  try {
    state.jobs = await fetchJobs();
  } catch (error) {
    console.error('Error fetching jobs:', error);
  } finally {
    state.isLoading = false;
  }
});
</script>
<template>
  <section class="bg-blue-50 px-4 py-10">
    <div class="container-xl lg:container m-auto">
      <h2 class="text-3xl font-bold text-green-500 mb-6 text-center">
        Browse Jobs
      </h2>
      <div
        v-if="state.isLoading"
        class="flex justify-center items-center py-20 w-full"
      >
        <PulseLoader color="#22c55e" size="15px" />
        <p class="text-gray-500 mt-4 font-medium">Loading jobs...</p>
      </div>
      <div
        v-else-if="state.jobs.length === 0"
        class="text-center text-gray-500 py-20 bg-white rounded-lg shadow-md"
      >
        <i class="pi pi-briefcase text-5xl mb-4 text-gray-300"></i>
        <h3 class="text-2xl font-bold mb-2">No Open Jobs available</h3>
        <p>Check back later for new opportunities.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <JobListing
          v-for="job in state.jobs.slice(0, limit || state.jobs.length)"
          :key="job.id"
          :job="job"
        />
      </div>
    </div>
  </section>

  <section v-if="showButton" class="m-auto max-w-lg my-10 px-6">
    <RouterLink
      class="block bg-black text-white text-center py-4 px-6 rounded-xl hover:bg-gray-700"
      to="/jobs"
      >View All Jobs
    </RouterLink>
  </section>
</template>
