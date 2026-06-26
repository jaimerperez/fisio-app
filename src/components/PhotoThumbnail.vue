<template>
  <div class="relative aspect-square">
    <img v-if="displaySrc" :src="displaySrc" :class="imgClass" @click="$emit('click')" />
    <div v-else :class="placeholderClass">
      <svg class="w-6 h-6 text-gray-300 animate-pulse" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M18 8.25h.008v.008H18V8.25Z"/>
      </svg>
    </div>
    <button v-if="removable" @click.stop="$emit('remove')" type="button"
      class="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center">
      <svg class="w-3 h-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { getPhotoUrl } from '@/lib/photos'

const props = withDefaults(defineProps<{
  src: string          // ruta de Storage o valor heredado (base64/URL)
  removable?: boolean
  rounded?: 'lg' | 'xl'
}>(), { removable: false, rounded: 'xl' })

defineEmits<{ remove: [], click: [] }>()

const displaySrc = ref<string>('')

watch(() => props.src, async (value) => {
  displaySrc.value = ''
  if (!value) return
  try {
    displaySrc.value = await getPhotoUrl(value)
  } catch {
    displaySrc.value = ''
  }
}, { immediate: true })

const imgClass = computed(() =>
  `w-full h-full object-cover rounded-${props.rounded}` +
  (props.removable ? '' : ' cursor-pointer')
)

const placeholderClass = computed(() =>
  `w-full h-full flex items-center justify-center bg-gray-50 rounded-${props.rounded}`
)
</script>
