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
      <div
        @click="onConfiguration"
        class="cursor-pointer w-full flex gap-2 items-center hover:bg-secondary transition-colors"
      >
        <IconMenuConfiguration class="w-4 h-4 text-white" />
        <p class="text-base text-white text-sm">{{ t('menu.configuration.title') }}</p>
      </div>
    </div>
    <teleport to="body">
      <section
        class="flex flex-col absolute bg-secondary left-0 top-0 p-5 w-full min-h-100vh overflow-y-auto overflow-x-hidden"
        v-if="showConfiguration"
      >
        <div class="flex w-full items-center justify-between px-10">
          <h1 class="text-lg text-white poppins">{{ t('menu.configuration.title') }}</h1>
          <IconTabClose
            @click="showConfiguration = false"
            class="w-7 h-7 text-gray hover:text-white transition-colors cursor-pointer"
          />
        </div>
        <div class="flex raleway w-full mt-20">
          <div class="flex text-white flex-col gap-2 w-20%">
            <div
              @click="showConfigurationItems = 0"
              class="flex items-center gap-2 cursor-pointer hover:bg-primary transition-colors"
            >
              <IconMenuConfiguration class="w-5 h-5" />
              <p>{{ t('menu.configuration.preferences.title') }}</p>
            </div>
          </div>
          <div v-if="showConfigurationItems === 0" class="flex gap-2 flex-col w-full">
            <div class="flex justify-between w-100 gap-2 items-center text-white">
              <p>{{ t('menu.configuration.preferences.language') }}</p>
              <div class="bg-gray w-60">
                <v-select
                  class="text-black"
                  v-model="$i18n.locale"
                  :options="$i18n.availableLocales"
                />
              </div>
            </div>
            <div class="flex justify-between w-100 gap-2 items-center text-white">
              <p>{{ t('menu.configuration.preferences.searchProvider') }}</p>
              <div class="bg-gray w-60">
                <v-select
                  class="text-black"
                  v-model="OPTIONS.searchProvider"
                  :options="['google', 'duckduckgo', 'bing']"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </teleport>
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
import { useOptionsStore } from '../../stores/options'
import { useHistoryStore } from '../../stores/history'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePubsub } from 'vue-pubsub'

const HISTORY = useHistoryStore()
const OPTIONS = useOptionsStore()

const { t } = useI18n()
const pubsub = usePubsub()

const showConfiguration = ref<boolean>(false)
const showConfigurationItems = ref<number>(0)
const showHistoric = ref<boolean>(false)
const showHistoricHoverIndex = ref<number>(-1)

const emit = defineEmits(['close-menu'])

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

const onConfiguration = () => {
  showConfiguration.value = !showConfiguration.value
}

const onHistoricItem = (url: string) => {
  pubsub.to('load-view-from-historic', url)

  showHistoric.value = false
}
</script>
