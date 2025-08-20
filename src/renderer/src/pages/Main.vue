<template>
  <main class="overflow-hidden">
    <HeaderRender />
    <RenderWebView />
    <DefaultPage v-if="NAVIGATOR.stateLink.loadedURL === 'default' || NAVIGATOR.views.length === 0" />
    <LoadPage v-else-if="NAVIGATOR.stateLink.loadedURL === 'loading'" />
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useNavigatorStore } from '../stores/navigator';
import { usePubsub } from 'vue-pubsub';

const NAVIGATOR = useNavigatorStore()

const pubsub = usePubsub()

onMounted(() => {
  pubsub.to("add-first-page", '')
})
</script>
