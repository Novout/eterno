<template>
  <IconDownloadPDF v-if="props.extension === 'pdf'" class="w-4 h-4 text-white" />
  <IconDownloadDefault v-else class="w-4 h-4 text-white" />
</template>

<script setup lang="ts">
const props = defineProps<{
  extension: 'pdf' | ''
}>()
</script>
