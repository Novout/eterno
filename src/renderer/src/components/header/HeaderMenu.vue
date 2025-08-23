<template>
  <section
    class="flex flex-col gap-5 absolute bg-secondary top-20 right-5 w-60 max-h-45 overflow-y-auto overflow-x-hidden rounded-lg"
  >
    <div class="flex flex-col p-2 raleway gap-2 w-full">
      <div
        @click="onHistoric"
        class="cursor-pointer w-full flex gap-2 items-center hover:bg-secondary transition-colors"
      >
        <IconMenuHistoric class="w-4 h-4 text-white" />
        <p class="text-base text-white text-sm">{{ t('menu.historic') }}</p>
      </div>
    </div>
    <div class="flex raleway flex-col gap-2 w-full max-h-60" v-if="showHistoric">
      <div
        class="flex p-2 justify-between items-center gap-2 hover:bg-primary transition-colors cursor-pointer"
        @click="onHistoricItem(item.url)"
        @mouseover="onHistoricItemMouseOver(index)"
        @mouseleave="onHistoricItemMouseLeave()"
        v-for="(item, index) in HISTORY.search"
        :key="index"
      >
        <div class="flex gap-2 w-full">
          <img v-if="item.icon" class="w-h h-4" :src="item.icon" />
          <p class="truncate text-white text-sm max-w-70%">{{ item.title }}</p>
        </div>
        <p class="text-xs text-white">
          {{ index === showHistoricHoverIndex ? item.date : item.date.split(' ')[1] }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useHistoryStore } from '../../stores/history'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePubsub } from 'vue-pubsub'

const HISTORY = useHistoryStore()

const { t } = useI18n()
const pubsub = usePubsub()

const showHistoric = ref<boolean>(false)
const showHistoricHoverIndex = ref<number>(-1)

const onHistoricItemMouseOver = (index: number) => {
  showHistoricHoverIndex.value = index
}

const onHistoricItemMouseLeave = () => {
  showHistoricHoverIndex.value = -1
}

const onHistoric = () => {
  if (HISTORY.search.length === 0) return

  showHistoric.value = !showHistoric.value
}

const onHistoricItem = (url: string) => {
  pubsub.to('load-view-from-historic', url)

  showHistoric.value = false
}
</script>
