<template>
  <main ref="main" class="overflow-hidden bg-primary px-1 pb-1">
    <HeaderRender />
    <RenderWebView />
    <DefaultPage
      v-if="NAVIGATOR.stateLink.loadedURL === 'default' || NAVIGATOR.views.length === 0"
    />
    <LoadPage v-else-if="NAVIGATOR.stateLink.loadedURL === 'loading'" />
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useNavigatorStore } from '../stores/navigator'
import { usePubsub } from 'vue-pubsub'
import { useEventListener } from '@vueuse/core'

const NAVIGATOR = useNavigatorStore()

const pubsub = usePubsub()

const main = ref<HTMLElement | null>(null)

onMounted(() => {
  pubsub.to('add-first-page', '')

  useEventListener(main, 'mouseup', ({ button }) => {
    if (NAVIGATOR.stateLink.loadedURL !== 'webview') return

    switch (button) {
      case 3:
        pubsub.to('view-back-in-view', '')
        break
      case 4:
        pubsub.to('view-forward-in-view', '')
        break
    }
  })
})
</script>
