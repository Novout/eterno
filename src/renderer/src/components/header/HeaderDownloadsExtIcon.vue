<template>
  <IconDownloadPDF v-if="props.extension === 'pdf'" class="w-5 h-5 text-red" />
  <IconDownloadDefault v-else class="w-5 h-5 text-white" />
</template>

<script setup lang="ts">
const props = defineProps<{
  extension: 'pdf' | ''
}>()
</script>
