<template>
  <div
    :style="{
      width: `${width / 4}px`
    }"
    @click="onLoadTab"
    class="flex items-center gap-2 min-h-10 h-full cursor-pointer overflow-x-auto"
  >
    <div class="flex justify-center items-center gap-2 w-85% h-full cursor-pointer overflow-x-auto">
      <IconSpinner v-if="!props.tab.loadedFavicon" class="h-4 w-4" />
      <img
        v-else-if="props.tab.icon"
        class="pl-4"
        :src="props.tab.icon"
        alt="icon from target website"
      />
      <IconViewTab v-else class="w-4 h-4" />
      <IconAudioOn @click="onMutedSound" class="h-5 w-5 cursor-pointer" v-if="audio === 'on'" />
      <IconAudioMuted
        @click="onActiveSound"
        class="h-5 w-5 cursor-pointer"
        v-else-if="audio === 'muted'"
      />
      <p
        :class="[views[NAVIGATION.activeTab] === props.tab && views.length > 20 ? 'hidden' : '']"
        class="truncate raleway text-sm"
      >
        {{ props.tab.title }}
      </p>
    </div>
    <IconTabClose
      v-if="NAVIGATION.views.length !== 1"
      @click="onCloseTab"
      :class="[
        views[NAVIGATION.activeTab] === props.tab && views.length > 20 ? 'absolute' : 'flex'
      ]"
      class="h-5 w-5 cursor-pointer"
    />
  </div>
</template>

<script setup lang="ts">
import { useNavigatorStore } from '@/stores/navigator'
import { HeaderTabItem } from '@/types'
import { WebviewTag } from 'electron/renderer'
import { computed, onMounted, ref } from 'vue'
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize()

const NAVIGATION = useNavigatorStore()

const audio = ref<'muted' | 'on' | false>(false)
const asAudio = ref<boolean>(false)
const views = computed(() => NAVIGATION.views)

const props = defineProps<{
  tab: HeaderTabItem
}>()

const emit = defineEmits(['load', 'close'])

const onLoadTab = () => {
  emit('load', props.tab, { force: false, removed: false })
}

const onCloseTab = () => {
  emit('close', props.tab)
}

onMounted(() => {
  const reader = getReader()

  reader?.addEventListener('dom-ready', () => {
    setInterval(() => {
      try {
        if (reader?.isCurrentlyAudible() && !asAudio.value) {
          audio.value = 'on'
          asAudio.value = true
        }
      } catch (e) {}
    }, 1000)
  })
})

const onActiveSound = () => {
  const reader = getReader()

  reader?.setAudioMuted(false)
  audio.value = 'on'
}

const onMutedSound = () => {
  const reader = getReader()

  reader?.setAudioMuted(true)
  audio.value = 'muted'
}

const getReader = () => {
  return document.querySelector<WebviewTag>(`#__render_${props.tab.id}`)
}
</script>
