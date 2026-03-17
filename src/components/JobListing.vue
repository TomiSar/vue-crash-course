<script setup>
import { defineProps, ref, computed } from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps({
  job: {
    type: Object,
    required: true,
  },
});

const showFullDescription = ref(false);

const toggleFullDescription = () => {
  showFullDescription.value = !showFullDescription.value;
};

const truncatedDescription = computed(() => {
  let description = props.job.description;
  if (!showFullDescription.value) {
    description = description.substring(0, 90) + '...';
  }
  return description;
});
</script>

<template>
  <div class="bg-white rounded-xl shadow-md relative">
    <div class="p-4">
      <div class="mb-6">
        <div class="text-gray-600 my-2">{{ job.type }}</div>
        <h3 class="text-xl font-bold">{{ job.title }}</h3>
      </div>

      <div class="mb-5">
        <div>
          {{ truncatedDescription }}
        </div>
        <button
          class="text-green-500 hover:text-green-600 mb-5"
          @click="toggleFullDescription"
        >
          {{ showFullDescription ? 'Less' : 'More' }}
        </button>
      </div>

      <h3 class="text-green-500 mb-2">{{ job.salary }}</h3>
      <div class="border border-gray-100 mb-5"></div>

      <div class="flex flex-col xl:flex-row justify-between mb-4">
        <div class="text-orange-700 mb-3">
          <i class="pi pi-map-marker text-orange-700"></i>
          {{ job.location }}
        </div>
        <div class="flex flex-col xl:flex-row gap-2 xl:gap-4 w-full xl:w-auto">
          <RouterLink
            class="h-[36px] bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-center text-xs xl:text-sm w-full xl:w-auto"
            :to="`/jobs/${job.id}`"
          >
            Read More
          </RouterLink>
          <RouterLink
            class="h-[36px] bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-center text-xs xl:text-sm w-full xl:w-auto"
            :to="`/jobs/edit/${job.id}`"
          >
            Edit Job
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
