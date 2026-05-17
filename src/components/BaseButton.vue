<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md'
  disabled?: boolean
  loading?: boolean
  loadingText?: string
}>()
</script>

<template>
  <button
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
      (!size || size === 'md') && 'px-4 py-2.5 rounded-xl text-sm',
      size === 'sm'            && 'px-3 py-1.5 rounded-xl text-sm',
      (!variant || variant === 'primary') && 'bg-primary-600 text-white hover:bg-primary-700',
      variant === 'secondary' && 'border border-gray-200 text-gray-600 hover:bg-gray-50',
      variant === 'danger'    && 'bg-red-500 text-white hover:bg-red-600',
      variant === 'ghost'     && 'text-primary-600 bg-primary-50 hover:bg-primary-100',
    ]"
  >
    <slot v-if="!loading" />
    <template v-else>{{ loadingText ?? 'Guardando...' }}</template>
  </button>
</template>
