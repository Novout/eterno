<template>
  <IconDownloadPDF v-if="props.extension === 'pdf'" class="w-5 h-5 text-red" />
  <IconDownloadEXE v-else-if="props.extension === 'exe'" class="w-5 h-5 text-white" />
  <IconDownloadDOC v-else-if="props.extension.startsWith('doc')" class="w-5 h-5 text-blue" />
  <IconDownloadDefault v-else class="w-5 h-5 text-white" />
</template>

<script setup lang="ts">
const props = defineProps<{
  extension: 'pdf' | 'exe' | 'doc' | ''
}>()
</script>
