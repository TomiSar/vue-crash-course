<script setup>
import { defineProps, reactive, onMounted, computed } from 'vue';
import { PulseLoader } from 'vue-spinner';
import { RouterLink } from 'vue-router';
import JobListing from '@/components/JobListing.vue';
import { fetchJobs } from '@/api/jobs';

const props = defineProps({
  jobLimit: Number,
  showAllJobsButton: {
    type: Boolean,
    default: false,
  },
});

const state = reactive({
  jobLimit: props.jobLimit || 3,
  jobs: [],
  isLoading: true,
  sortBy: '', // '' (no sort), 'title-asc', 'title-desc', 'salary-asc', 'salary-desc'
  selectedType: 'All',
});

const jobTypeOptions = [
  'All',
  'Full-Time',
  'Part-Time',
  'Remote',
  'Contract',
  'Internship',
];

const toggleSort = (sortOption) => {
  if (state.sortBy === sortOption) {
    state.sortBy = ''; // Remove sort if clicked again
  } else {
    state.sortBy = sortOption;
  }
};

const getSalaryValue = (salary) => parseInt(salary?.replace(/\D/g, '') || 0);

const sortStrategies = {
  'title-asc': (a, b) => a.title.localeCompare(b.title),
  'title-desc': (a, b) => b.title.localeCompare(a.title),
  'salary-asc': (a, b) => getSalaryValue(a.salary) - getSalaryValue(b.salary),
  'salary-desc': (a, b) => getSalaryValue(b.salary) - getSalaryValue(a.salary),
};

const filteredJobs = computed(() => {
  const jobsCopy = [...state.jobs];
  const jobsByType =
    state.selectedType === 'All'
      ? jobsCopy
      : jobsCopy.filter((job) => job.type === state.selectedType);

  const sortFn = sortStrategies[state.sortBy];
  return sortFn ? jobsByType.sort(sortFn) : jobsByType;
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
        <div class="flex flex-col sm:flex-row items-center gap-3">
          <label class="text-2xl font-bold text-gray-500">Job type</label>
          <select
            v-model="state.selectedType"
            class="border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option v-for="type in jobTypeOptions" :key="type" :value="type">
              {{ type === 'All' ? 'All' : type }}
            </option>
          </select>
          <label class="text-2xl font-bold text-gray-500 ml-4"
            >Job(s) per page</label
          >
          <input
            type="number"
            v-model.number="state.jobLimit"
            min="1"
            :max="filteredJobs.length"
            class="w-20 border rounded-lg px-3 py-2"
          />
        </div>
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
            Salary Low-High
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
            Salary High-Low
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
        v-else-if="filteredJobs.length === 0"
        class="text-center text-gray-500 py-20 bg-white rounded-lg shadow-md"
      >
        <i class="pi pi-briefcase text-5xl mb-4 text-gray-300"></i>
        <h3 class="text-2xl font-bold mb-2">
          {{
            state.selectedType === 'All'
              ? 'No open jobs available'
              : `No open ${state.selectedType} jobs available`
          }}
        </h3>
        <p>Check back later for new opportunities.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <JobListing
          v-for="job in filteredJobs.slice(
            0,
            state.jobLimit || filteredJobs.length,
          )"
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
