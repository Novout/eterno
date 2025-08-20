<template>
  <div @click="onLoadTab" class="flex justify-center items-center gap-2 w-60 h-20 h-full cursor-pointer">
    <img :src="props.tab.icon" />
    <IconAudioOn @click="onMutedSound" class="h-5 w-5 cursor-pointer text-white" v-if="audio === 'on'" />
    <IconAudioMuted @click="onActiveSound" class="h-5 w-5 cursor-pointer text-white" v-else-if="audio === 'muted'" />
    <p class="text-white truncate">{{ props.tab.title }}</p>
    <IconTabClose v-if="NAVIGATION.views.length !== 1" @click="onCloseTab" class="h-5 w-5 cursor-pointer text-white" />
  </div>
</template>

<script setup lang="ts">
import { useNavigatorStore } from '../../stores/navigator';
import { HeaderTabItem } from '../../types';
import { WebviewTag } from 'electron/renderer';
import { onMounted, ref } from 'vue';

const NAVIGATION = useNavigatorStore()

const audio = ref<'muted' | 'on' | false>(false)
const asAudio = ref<boolean>(false)

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
  setInterval(() => {
    const reader = getReader()

    if(reader?.isCurrentlyAudible() && !asAudio.value) {
      audio.value = 'on'
      asAudio.value = true
    }
  }, 1000)
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
