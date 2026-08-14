<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: 'Confirm',
  },
  message: {
    type: String,
    default: '',
  },
  confirmText: {
    type: String,
    default: 'Yes',
  },
  cancelText: {
    type: String,
    default: 'Cancel',
  },
});

const emit = defineEmits(['confirm', 'cancel']);

const handleConfirm = () => {
  emit('confirm');
};

const handleCancel = () => {
  emit('cancel');
};
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center"
  >
    <!-- Backdrop -->
    <div
      class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
      @click="handleCancel"
    ></div>

    <!-- Modal Content -->
    <div
      class="relative bg-white rounded-lg shadow-xl p-8 max-w-sm w-full mx-4"
    >
      <h2 class="text-2xl font-bold mb-2 text-gray-800 text-center">
        {{ title }}
      </h2>
      <p class="text-gray-600 mb-8 text-center">{{ message }}</p>

      <!-- Buttons Container -->
      <div class="flex gap-4 justify-center">
        <!-- Cancel Button (Left) -->
        <button
          class="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition"
          @click="handleCancel"
        >
          {{ cancelText }}
        </button>
        <!-- Confirm Button (Right) -->
        <button
          class="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition"
          @click="handleConfirm"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>
