<script setup>
import { defineProps, reactive, onMounted, computed } from 'vue';
import { RouterLink } from 'vue-router';
import JobListing from '@/components/JobListing.vue';
import { PulseLoader } from 'vue-spinner';
import { fetchJobs } from '@/api/jobs';

defineProps({
  jobLimit: Number,
  showAllJobsButton: {
    type: Boolean,
    default: false,
  },
});

const state = reactive({
  jobs: [],
  isLoading: true,
  sortBy: '', // '' (no sort), 'title-asc', 'title-desc', 'salary-asc', 'salary-desc'
});

const toggleSort = (sortOption) => {
  if (state.sortBy === sortOption) {
    state.sortBy = ''; // Remove sort if clicked again
  } else {
    state.sortBy = sortOption;
  }
};

const sortedJobs = computed(() => {
  const jobsCopy = [...state.jobs];

  if (state.sortBy === 'title-asc') {
    return jobsCopy.sort((a, b) => a.title.localeCompare(b.title));
  } else if (state.sortBy === 'title-desc') {
    return jobsCopy.sort((a, b) => b.title.localeCompare(a.title));
  } else if (state.sortBy === 'salary-asc') {
    return jobsCopy.sort((a, b) => {
      const salaryA = parseInt(a.salary?.replace(/\D/g, '') || 0);
      const salaryB = parseInt(b.salary?.replace(/\D/g, '') || 0);
      return salaryA - salaryB;
    });
  } else if (state.sortBy === 'salary-desc') {
    return jobsCopy.sort((a, b) => {
      const salaryA = parseInt(a.salary?.replace(/\D/g, '') || 0);
      const salaryB = parseInt(b.salary?.replace(/\D/g, '') || 0);
      return salaryB - salaryA;
    });
  }
  return jobsCopy;
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
        v-if="!state.isLoading && state.jobs.length > 0"
        class="mb-6 flex flex-col items-center gap-4"
      >
        <div class="flex gap-2 flex-wrap justify-center">
          <h3 class="text-3xl font-bold text-gray-500">
            Filter {{ state.sortBy }}
          </h3>
          <button
            @click="toggleSort('title-asc')"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition',
              state.sortBy === 'title-asc'
                ? 'bg-green-500 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
            ]"
          >
            Title A-Z
          </button>
          <button
            @click="toggleSort('title-desc')"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition',
              state.sortBy === 'title-desc'
                ? 'bg-green-500 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
            ]"
          >
            Title Z-A
          </button>
          <button
            @click="toggleSort('salary-asc')"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition',
              state.sortBy === 'salary-asc'
                ? 'bg-green-500 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
            ]"
          >
            Salary: Low-High
          </button>
          <button
            @click="toggleSort('salary-desc')"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition',
              state.sortBy === 'salary-desc'
                ? 'bg-green-500 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
            ]"
          >
            Salary: High-Low
          </button>
        </div>
      </div>

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
          v-for="job in sortedJobs.slice(0, jobLimit || sortedJobs.length)"
          :key="job.id"
          :job="job"
        />
      </div>
    </div>
  </section>

  <section v-if="showAllJobsButton" class="m-auto max-w-lg my-10 px-6">
    <RouterLink
      class="block bg-black text-white text-center py-4 px-6 rounded-xl hover:bg-gray-700"
      to="/jobs"
      >View All Jobs
    </RouterLink>
  </section>
</template>
