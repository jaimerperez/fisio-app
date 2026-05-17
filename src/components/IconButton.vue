<template>
  <button @click="$emit('click')" :class="classes" type="button">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'default' | 'danger'
}>(), { variant: 'default' })

defineEmits<{ click: [] }>()

const classes = computed(() =>
  props.variant === 'danger'
    ? 'p-2 rounded-lg transition-colors text-gray-400 hover:text-red-500 hover:bg-red-50'
    : 'p-2 rounded-lg transition-colors text-gray-400 hover:text-primary-600 hover:bg-primary-50'
)
</script>
