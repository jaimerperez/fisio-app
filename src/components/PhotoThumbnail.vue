<template>
  <div class="relative aspect-square">
    <img :src="src" :class="imgClass" @click="$emit('click')" />
    <button v-if="removable" @click.stop="$emit('remove')" type="button"
      class="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center">
      <svg class="w-3 h-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  src: string
  removable?: boolean
  rounded?: 'lg' | 'xl'
}>(), { removable: false, rounded: 'xl' })

defineEmits<{ remove: [], click: [] }>()

const imgClass = computed(() =>
  `w-full h-full object-cover rounded-${props.rounded}` +
  (props.removable ? '' : ' cursor-pointer')
)
</script>
