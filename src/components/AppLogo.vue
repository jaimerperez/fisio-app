<template>
  <div :class="containerClass">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 47.55 48.26" :class="iconClass" fill="currentColor">
      <path d="M44.33,19.3h-24.15l-7.43-12.87h16.79c1.71,0,3.12-1.33,3.21-3.04h0C32.86,1.55,31.39,0,29.54,0H7.18C4.7,0,3.16,2.68,4.39,4.83l8.36,14.48H3.22c-1.78,0-3.22,1.44-3.22,3.22s1.44,3.22,3.22,3.22h13.25l12.07,20.91c1.24,2.14,4.33,2.14,5.57,0l13-22.52c1.24-2.14-.31-4.83-2.79-4.83ZM31.33,38.6l-7.43-12.87h14.86l-7.43,12.87Z"/>
      <circle cx="43.77" cy="3.71" r="3.71"/>
      <path d="M7.43,34.89c-2.05,0-3.71,1.66-3.71,3.71s1.66,3.71,3.71,3.71,3.71-1.66,3.71-3.71-1.66-3.71-3.71-3.71ZM7.43,41.05c-1.35,0-2.45-1.1-2.45-2.45s1.1-2.45,2.45-2.45,2.45,1.1,2.45,2.45-1.1,2.45-2.45,2.45Z"/>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'glass'
}>(), { size: 'md', variant: 'primary' })

const containerClass = computed(() => {
  const base = 'flex items-center justify-center shrink-0'
  const sizeMap = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-9 h-9 rounded-xl shadow-lg',
    lg: 'w-10 h-10 rounded-2xl',
  }
  const variantMap = {
    primary: 'bg-primary-600 text-white',
    glass: 'bg-white/20 text-white backdrop-blur-sm',
  }
  return `${base} ${sizeMap[props.size]} ${variantMap[props.variant]}`
})

const iconClass = computed(() => {
  const map = { sm: 'w-5 h-5', md: 'w-5.5 h-5.5', lg: 'w-6 h-6' }
  return map[props.size]
})
</script>
