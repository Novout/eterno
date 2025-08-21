<template>
  <div
    :class="[
      views[NAVIGATION.activeTab] === props.tab && views.length > 20
        ? 'min-w-9'
        : views.length < 4
          ? 'w-60'
          : views.length < 7
            ? 'w-34'
            : views.length < 10
              ? 'w-26'
              : views.length < 12
                ? 'w-12'
                : views.length < 15
                  ? 'w-10'
                  : 'w-5'
    ]"
    @click="onLoadTab"
    class="flex justify-center items-center gap-2 w-60 min-h-10 h-full cursor-pointer overflow-x-auto"
  >
    <img v-if="props.tab.icon" class="pl-4" :src="props.tab.icon" alt="icon from target website" />
    <IconViewTab v-else class="text-white w-4 h-4" />
    <IconAudioOn
      @click="onMutedSound"
      class="h-5 w-5 cursor-pointer text-white"
      v-if="audio === 'on'"
    />
    <IconAudioMuted
      @click="onActiveSound"
      class="h-5 w-5 cursor-pointer text-white"
      v-else-if="audio === 'muted'"
    />
    <p
      :class="[views[NAVIGATION.activeTab] === props.tab && views.length > 20 ? 'hidden' : '']"
      class="text-white truncate raleway text-sm"
    >
      {{ props.tab.title }}
    </p>
    <IconTabClose
      v-if="NAVIGATION.views.length !== 1"
      @click="onCloseTab"
      :class="[
        views[NAVIGATION.activeTab] === props.tab && views.length > 20 ? 'absolute' : 'flex'
      ]"
      class="h-5 w-5 cursor-pointer text-white"
    />
  </div>
</template>

<script setup lang="ts">
import { useNavigatorStore } from '../../stores/navigator'
import { HeaderTabItem } from '../../types'
import { WebviewTag } from 'electron/renderer'
import { computed, onMounted, ref } from 'vue'

const NAVIGATION = useNavigatorStore()

const audio = ref<'muted' | 'on' | false>(false)
const asAudio = ref<boolean>(false)
const views = computed(() => NAVIGATION.views)

const props = defineProps<{
  tab: HeaderTabItem
}>()

const emit = defineEmits(['load', 'close'])

const onLoadTab = () => {
  emit('load', props.tab)
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
