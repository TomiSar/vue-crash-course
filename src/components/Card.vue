<script setup>
import { defineProps } from 'vue';
defineProps({
  bgcolor: {
    type: String,
    default: 'bg-gray-100',
    required: false,
  },
});
</script>

<template>
  <div :class="`${bgcolor} p-6 rounded-lg shadow-md`">
    <slot></slot>
  </div>
</template>
