<template>
  <main class="overflow-hidden">
    <HeaderRender />
    <RenderWebView />
    <DefaultPage v-if="NAVIGATOR.stateLink.loadedURL === 'default' || NAVIGATOR.views.length === 0" />
    <LoadPage v-else-if="NAVIGATOR.stateLink.loadedURL === 'loading'" />
  </main>
</template>

<script setup lang="ts">
import { useNavigatorStore } from '../stores/navigator';

const NAVIGATOR = useNavigatorStore()
</script>
