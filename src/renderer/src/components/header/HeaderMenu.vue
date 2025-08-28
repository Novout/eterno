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
        <IconMenuDefines class="w-4 h-4 text-white" />
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
            @click="onClose"
            class="w-7 h-7 text-gray hover:text-white transition-colors cursor-pointer"
          />
        </div>
        <div class="flex raleway w-full mt-20">
          <div class="flex text-white flex-col gap-3 w-20% pr-10">
            <div
              @click="showConfigurationItems = 0"
              class="flex items-center gap-2 cursor-pointer hover:bg-primary transition-colors"
            >
              <IconMenuConfiguration class="w-5 h-5" />
              <p>{{ t('menu.configuration.preferences.title') }}</p>
            </div>
            <div
              @click="showConfigurationItems = 1"
              class="flex items-center gap-2 cursor-pointer hover:bg-primary transition-colors"
            >
              <IconMenuDefines class="w-5 h-5" />
              <p>{{ t('menu.configuration.defines.title') }}</p>
            </div>
          </div>
          <div v-if="showConfigurationItems === 0" class="flex gap-8 flex-col w-full">
            <div class="flex justify-between w-130 gap-2 items-center text-white">
              <div class="flex flex-col gap-1 w-full">
                <h2 class="text-white">{{ t('menu.configuration.preferences.language.title') }}</h2>
                <p class="text-gray text-xs">
                  {{ t('menu.configuration.preferences.language.description') }}
                </p>
              </div>
              <div>
                <MaterialList v-model="$i18n.locale" :list="$i18n.availableLocales" />
              </div>
            </div>
            <div class="flex justify-between w-130 gap-2 items-center text-white">
              <div class="flex flex-col gap-1 w-full">
                <h2 class="text-white">
                  {{ t('menu.configuration.preferences.searchProvider.title') }}
                </h2>
                <p class="text-gray text-xs">
                  {{ t('menu.configuration.preferences.searchProvider.description') }}
                </p>
              </div>
              <div>
                <MaterialList
                  v-model="OPTIONS.preferences.searchProvider"
                  :list="['google', 'duckduckgo', 'bing']"
                />
              </div>
            </div>
            <div class="flex justify-between w-100 gap-2 items-center text-white">
              <div class="flex flex-col gap-1 w-full">
                <h2 class="text-white text-base">
                  {{ t('menu.configuration.preferences.noticesInHomePage.title') }}
                </h2>
                <p class="text-gray text-xs">
                  {{ t('menu.configuration.preferences.noticesInHomePage.description') }}
                </p>
              </div>
              <div class="w-60">
                <MaterialButton v-model="OPTIONS.preferences.noticesInHomePage" />
              </div>
            </div>
            <div
              v-if="OPTIONS.preferences.noticesInHomePage"
              class="flex justify-between w-100 gap-2 items-center text-white"
            >
              <div class="flex flex-col gap-1 w-full">
                <h2 class="text-white text-base">
                  {{ t('menu.configuration.preferences.noticesInHomePage.link.title') }}
                </h2>
                <p class="text-gray text-xs">
                  {{ t('menu.configuration.preferences.noticesInHomePage.link.description') }}
                </p>
              </div>
              <div class="w-60">
                <MaterialInputText v-model="OPTIONS.preferences.noticesInHomePageLink" />
              </div>
            </div>
          </div>
          <div v-if="showConfigurationItems === 1" class="flex gap-8 flex-col w-full">
            <div class="flex justify-between w-130 gap-2 items-center text-white">
              <div class="flex flex-col gap-1 w-full">
                <h2 class="text-white">
                  {{ t('menu.configuration.defines.saveLocalData.title') }}
                </h2>
                <p class="text-gray text-xs">
                  {{ t('menu.configuration.defines.saveLocalData.description') }}
                </p>
              </div>
              <div>
                <MaterialButton v-model="OPTIONS.defines.saveLocalData" />
              </div>
            </div>
            <div class="flex justify-between w-130 gap-2 items-center text-white">
              <div class="flex flex-col gap-1 w-full">
                <h2 class="text-white">
                  {{ t('menu.configuration.defines.deleteLocalData.title') }}
                </h2>
                <p class="text-gray text-xs">
                  {{ t('menu.configuration.defines.deleteLocalData.description') }}
                </p>
              </div>
              <div>
                <button
                  class="p-3 bg-primary hover:bg-tertiary transition-colors text-white cursor-pointer rounded-lg border-none"
                  @click="onDeleteData"
                >
                  {{ t('menu.configuration.defines.deleteLocalData.delete') }}
                </button>
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
import { useOptionsStore } from '@/stores/options'
import { useHistoryStore } from '@/stores/history'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePubsub } from 'vue-pubsub'
import { useData } from '@/use/data'
import { useToast } from 'vue-toastification'

const HISTORY = useHistoryStore()
const OPTIONS = useOptionsStore()

const { t } = useI18n()
const pubsub = usePubsub()
const data = useData()
const toast = useToast()

const showConfiguration = ref<boolean>(false)
const showConfigurationItems = ref<number>(0)
const showHistoric = ref<boolean>(false)
const showHistoricHoverIndex = ref<number>(-1)

const emit = defineEmits(['close-menu'])

const onDeleteData = () => {
  data
    .remove('main')
    .then(() => {
      toast.success(t('toast.successInDeleteData'))
    })
    .catch(() => {})
}

const onClose = () => {
  showConfiguration.value = false

  pubsub.to('render-hide-configuration', '')
}

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
