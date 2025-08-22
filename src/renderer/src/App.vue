<template>
  <RouterView />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

const { ipcRenderer } = window.require('electron')

const foo = async () => {
  await ipcRenderer.invoke('store-set', 'foo', 'test')
  const foo = await ipcRenderer.invoke('store-get', 'foo')

  console.log(foo)
}

onMounted(() => {
  foo()
})
</script>
