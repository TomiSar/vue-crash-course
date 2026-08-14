<script setup>
import { reactive, onMounted } from 'vue';
import { useRoute, RouterLink, useRouter } from 'vue-router';
import { PulseLoader } from 'vue-spinner';
import { fetchJobById, deleteJob } from '../api/jobs';
import BackButton from '../components/BackButton.vue';
import Modal from '../components/Modal.vue';
import { useToast, POSITION } from 'vue-toastification';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const jobId = route.params.id;
const state = reactive({
  job: null,
  isLoading: true,
  isDeleteModalOpen: false,
});

const openDeleteModal = () => {
  state.isDeleteModalOpen = true;
};

const closeDeleteModal = () => {
  state.isDeleteModalOpen = false;
};

const handleDeleteJob = async () => {
  try {
    await deleteJob(jobId);
    toast.success('Job deleted successfully!', {
      position: POSITION.TOP_RIGHT,
      timeout: 2000,
    });
    closeDeleteModal();
    router.push('/jobs');
  } catch (error) {
    console.error('Error deleting job:', error);
    toast.error('Error deleting job!', {
      position: POSITION.TOP_RIGHT,
      timeout: 2000,
    });
    closeDeleteModal();
  }
};

onMounted(async () => {
  try {
    state.job = await fetchJobById(jobId);
  } catch (error) {
    console.error('Error fetching job:', error);
  } finally {
    state.isLoading = false;
  }
});
</script>

<template>
  <BackButton />
  <section class="bg-green-50" v-if="!state.isLoading && state.job">
    <div class="container m-auto py-10 px-6">
      <div class="grid grid-cols-1 md:grid-cols-70/30 w-full gap-6">
        <main>
          <div
            class="bg-white p-6 rounded-lg shadow-md text-center md:text-left"
          >
            <div class="text-gray-500 mb-4">{{ state.job.type }}</div>
            <h1 class="text-3xl font-bold mb-4">{{ state.job.title }}</h1>
            <div
              class="text-gray-500 mb-4 flex align-middle justify-center md:justify-start"
            >
              <i class="pi pi-map-marker text-lg text-orange-700 mr-2"></i>
              <p class="text-orange-700">{{ state.job.location }}</p>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-md mt-6">
            <h3 class="text-green-800 text-lg font-bold mb-6">
              Job Description
            </h3>

            <p class="mb-4">
              {{ state.job.description }}
            </p>
            <h3 class="text-green-800 text-lg font-bold mb-2">Salary</h3>
            <p class="mb-4">{{ state.job.salary }} / Year</p>
          </div>
        </main>

        <!-- Sidebar -->
        <aside>
          <!-- Company Info -->
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-bold mb-6">Company Info</h3>
            <h2 class="text-2xl">{{ state.job.company.name }}</h2>
            <p class="my-2">
              {{ state.job.company.description }}
            </p>
            <hr class="my-4" />
            <h3 class="text-xl">Contact Email:</h3>
            <p class="my-2 bg-green-100 p-2 font-bold">
              {{ state.job.company.contactEmail }}
            </p>
            <h3 class="text-xl">Contact Phone:</h3>
            <p class="my-2 bg-green-100 p-2 font-bold">
              {{ state.job.company.contactPhone }}
            </p>
          </div>

          <!-- Manage -->
          <div class="bg-white p-6 rounded-lg shadow-md mt-6">
            <h3 class="text-xl font-bold mb-6">Manage Job</h3>
            <RouterLink
              class="bg-green-500 hover:bg-green-600 text-white text-center font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
              :to="`/jobs/edit/${state.job.id}`"
            >
              Edit Job
            </RouterLink>
            <button
              class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
              @click="openDeleteModal"
            >
              Delete Job
            </button>
          </div>
        </aside>
      </div>
    </div>
  </section>

  <div
    v-else-if="state.isLoading"
    class="flex flex-col justify-center items-center py-40"
  >
    <PulseLoader color="#22c55e" size="15px" />
    <p class="text-gray-500 mt-4 font-medium">Loading jobs...</p>
  </div>
  <div
    v-else
    class="text-center text-gray-500 py-20 bg-white m-4 rounded-lg shadow-md"
  >
    <i class="pi pi-exclamation-circle text-4xl text-gray-300 mb-4"></i>
    <p class="text-xl">Job not found.</p>
    <RouterLink to="/jobs" class="text-green-500 hover:underline mt-2 block">
      Back to Job Listings
    </RouterLink>
  </div>

  <Modal
    :isOpen="state.isDeleteModalOpen"
    title="Delete Job"
    :message="`Are you sure you want to delete ${state.job?.title} job? This action cannot be undone.`"
    confirmText="Yes"
    cancelText="Cancel"
    @confirm="handleDeleteJob"
    @cancel="closeDeleteModal"
  />
</template>
