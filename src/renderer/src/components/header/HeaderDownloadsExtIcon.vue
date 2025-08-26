<template>
  <IconDownloadPDF v-if="props.extension === 'pdf'" class="w-6 h-6 text-red" />
  <IconDownloadEXE v-else-if="props.extension === 'exe'" class="w-6 h-6 text-white" />
  <IconDownloadDOCX v-else-if="props.extension.startsWith('doc')" class="w-6 h-6 text-blue" />
  <IconDownloadTXT v-else-if="props.extension === 'txt'" class="w-6 h-6 text-white" />
  <IconDownloadDefault v-else class="w-6 h-6 text-white" />
</template>

<script setup lang="ts">
const props = defineProps<{
  extension: 'pdf' | 'exe' | 'doc' | 'txt' | ''
}>()
</script>
