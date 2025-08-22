<template>
  <RouterView />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useData } from './use/data'
import { useSharedStore } from './stores/shared'

const SHARED = useSharedStore()

const data = useData()

onMounted(() => {
  data
    .get('initialize')
    .then((values) => {
      if (values && typeof values !== 'string') SHARED.start(values)
    })
    .catch(() => {})
})

onUnmounted(() => {
  SHARED.save()
})
</script>
