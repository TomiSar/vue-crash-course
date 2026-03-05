<script setup>
import router from '@/router';
import { onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { fetchJobById, updateJob } from '../api/jobs';
import { POSITION, useToast } from 'vue-toastification';

const route = useRoute();
const jobId = route.params.id;
const toast = useToast();

const form = reactive({
  type: 'Full-Time',
  title: '',
  description: '',
  salary: '',
  location: '',
  company: {
    name: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
  },
});

const state = reactive({
  job: { company: {} },
  isLoading: true,
});

const handleSubmit = async () => {
  const editJob = {
    type: form.type,
    title: form.title,
    description: form.description,
    salary: form.salary,
    location: form.location,
    company: {
      name: form.company.name,
      description: form.company.description,
      contactEmail: form.company.contactEmail,
      contactPhone: form.company.contactPhone,
    },
  };

  try {
    const response = await updateJob(jobId, editJob);
    toast.success('Job updated successfully!', {
      position: POSITION.TOP_RIGHT,
      timeout: 2000,
    });
    router.push(`/jobs/${response.id}`);
  } catch (error) {
    console.error('Error updating job:', error);
    toast.error('Error updating job!', {
      position: POSITION.TOP_RIGHT,
      timeout: 2000,
    });
  }
};

onMounted(async () => {
  // Populate form with existing job data if needed (fetch job by ID and set form values)
  try {
    const response = await fetchJobById(jobId);
    state.job = response;
    // Populate inputs with existing job data
    form.type = response.type;
    form.title = response.title;
    form.description = response.description;
    form.salary = response.salary;
    form.location = response.location;
    form.company.name = response.company.name;
    form.company.description = response.company.description;
    form.company.contactEmail = response.company.contactEmail;
    form.company.contactPhone = response.company.contactPhone;
  } catch (error) {
    console.error('Error fetching job', error);
  } finally {
    state.isLoading = false;
  }
});
</script>

<template>
  <section class="bg-green-50">
    <div class="container m-auto max-w-2xl py-24">
      <div
        class="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0"
      >
        <form @submit.prevent="handleSubmit">
          <h2 class="text-3xl text-center font-semibold mb-6">Edit Job</h2>

          <div class="mb-4">
            <label for="type" class="block text-gray-700 font-bold mb-2"
              >Job Type</label
            >
            <select
              class="border rounded w-full py-2 px-3"
              id="type"
              name="type"
              v-model="form.type"
              required
            >
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Remote">Remote</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 font-bold mb-2"
              >Job Listing Name</label
            >
            <input
              class="border rounded w-full py-2 px-3 mb-2"
              type="text"
              id="name"
              name="name"
              v-model="form.title"
              placeholder="eg. Beautiful Apartment In Miami"
              required
            />
          </div>
          <div class="mb-4">
            <label for="description" class="block text-gray-700 font-bold mb-2"
              >Description</label
            >
            <textarea
              class="border rounded w-full py-2 px-3"
              id="description"
              name="description"
              v-model="form.description"
              rows="4"
              placeholder="Add any job duties, expectations, requirements, etc"
            ></textarea>
          </div>

          <div class="mb-4">
            <label for="type" class="block text-gray-700 font-bold mb-2"
              >Salary</label
            >
            <select
              id="salary"
              name="salary"
              v-model="form.salary"
              class="border rounded w-full py-2 px-3"
              required
            >
              <option value="Under $50K">under $50K</option>
              <option value="$50K - $60K">$50 - $60K</option>
              <option value="$60K - $70K">$60 - $70K</option>
              <option value="$70K - $80K">$70 - $80K</option>
              <option value="$80K - $90K">$80 - $90K</option>
              <option value="$90K - $100K">$90 - $100K</option>
              <option value="$100K - $125K">$100 - $125K</option>
              <option value="$125K - $150K">$125 - $150K</option>
              <option value="$150K - $175K">$150 - $175K</option>
              <option value="$175K - $200K">$175 - $200K</option>
              <option value="Over $200K">Over $200K</option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 font-bold mb-2"> Location </label>
            <input
              class="border rounded w-full py-2 px-3 mb-2"
              type="text"
              id="location"
              name="location"
              v-model="form.location"
              placeholder="Company Location"
              required
            />
          </div>

          <h3 class="text-2xl mb-5">Company Info</h3>

          <div class="mb-4">
            <label for="company" class="block text-gray-700 font-bold mb-2"
              >Company Name</label
            >
            <input
              class="border rounded w-full py-2 px-3"
              type="text"
              id="company"
              name="company"
              v-model="form.company.name"
              placeholder="Company Name"
            />
          </div>

          <div class="mb-4">
            <label
              for="company_description"
              class="block text-gray-700 font-bold mb-2"
              >Company Description</label
            >
            <textarea
              class="border rounded w-full py-2 px-3"
              id="company_description"
              name="company_description"
              v-model="form.company.description"
              rows="4"
              placeholder="What does your company do?"
            ></textarea>
          </div>

          <div class="mb-4">
            <label
              for="contact_email"
              class="block text-gray-700 font-bold mb-2"
              >Contact Email</label
            >
            <input
              class="border rounded w-full py-2 px-3"
              type="email"
              id="contact_email"
              name="contact_email"
              v-model="form.company.contactEmail"
              placeholder="Email address for applicants"
              required
            />
          </div>
          <div class="mb-4">
            <label
              for="contact_phone"
              class="block text-gray-700 font-bold mb-2"
              >Contact Phone</label
            >
            <input
              class="border rounded w-full py-2 px-3"
              type="tel"
              id="contact_phone"
              name="contact_phone"
              v-model="form.company.contactPhone"
              placeholder="Optional phone for applicants"
            />
          </div>

          <div>
            <button
              class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Update Job
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
