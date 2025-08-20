<template>
  <webview
    :id="`__render_${view.id}`"
    class="webkit"
    :class="[
      NAVIGATOR.views[NAVIGATOR.activeTab] === view && NAVIGATOR.stateLink.loadedURL === 'webview'
        ? 'flex'
        : 'hidden'
    ]"
    :key="view.id"
    v-for="view in NAVIGATOR.views"
    ref="__render"
    :src="view.url"
  />
</template>

<script setup lang="ts">
import { useNavigatorStore } from '../../../stores/navigator'

const NAVIGATOR = useNavigatorStore()
</script>
