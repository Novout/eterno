<template>
  <section
    class="flex flex-col raleway absolute bg-secondary top-20 right-15 w-70 max-h-45 overflow-y-auto overflow-x-hidden rounded-lg"
  >
    <p class="text-white p-3 text-lg">Downloads</p>
    <div
      v-if="HISTORY.downloadInProgress"
      class="flex flex-col gap-3 items-center p-3 justify-between border border-b-2 border-gray gap-2 w-full pb-10"
    >
      <div class="flex w-full justify-between items-center">
        <div class="flex items-center gap-2">
          <img
            v-if="HISTORY.downloadInProgress.icon"
            :src="HISTORY.downloadInProgress.icon"
            alt="download icon"
          />
          <HeaderDownloadsExtIcon v-else :extension="HISTORY.downloadInProgress.ext" />
          <p class="text-white truncate">{{ HISTORY.downloadInProgress.filename }}</p>
        </div>
        <div class="flex items-center gap-2">
          <IconPause
            v-if="!isPaused"
            class="w-5 h-5 text-gray hover:text-white transition-colors cursor-pointer"
            @click="onPauseDownload"
          />
          <IconResume
            v-else
            class="w-5 h-5 text-gray hover:text-white transition-colors cursor-pointer"
            @click="onResumeDownload"
          />
          <IconTabClose
            class="w-5 h-5 text-gray hover:text-white transition-colors cursor-pointer"
            @click="onCancelDownload"
          />
        </div>
      </div>
      <div class="w-full h-3 bg-primary rounded-full shadow-lg">
        <div
          class="h-3 bg-primary-colored rounded-full"
          :style="{
            width: `${((HISTORY.downloadInProgress.receivedBytes / HISTORY.downloadInProgress.totalBytes) * 100).toFixed(2)}%`
          }"
        />
      </div>
    </div>
    <div class="flex flex-col gap-3 w-full">
      <div
        @click="onOpen(download.savePath)"
        class="flex gap-2 p-3 w-full cursor-pointer hover:bg-primary"
        v-for="(download, index) in HISTORY.downloads"
        :key="index"
      >
        <img v-if="download.icon" :src="download.icon" alt="download icon" />
        <HeaderDownloadsExtIcon v-else :extension="download.ext" />
        <div class="flex justify-between w-full truncate text-sm">
          <p class="text-white truncate w-70%">{{ download.filename }}</p>
          <p class="text-white truncate">{{ download.date.split(' ')[1] }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useHistoryStore } from '@/stores/history'
import { useDownload } from '@/use/download'
import { usePath } from '@/use/path'
import { usePubsub } from 'vue-pubsub'
import IconTabClose from '../icons/IconTabClose.vue'
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'

const HISTORY = useHistoryStore()

const path = usePath()
const pubsub = usePubsub()
const download = useDownload()
const toast = useToast()
const { t } = useI18n()

const isPaused = ref<boolean>(false)

const onOpen = (filepath: string) => {
  pubsub.to('download-finished', '')

  path.openFolder(filepath).catch(() => {
    toast.error(t('toast.errorInOpenFolder'))
  })
}

const onResumeDownload = () => {
  isPaused.value = false

  download.resume()
}

const onPauseDownload = () => {
  isPaused.value = true

  download.pause()
}

const onCancelDownload = () => {
  HISTORY.downloadInProgress = undefined

  isPaused.value = false

  pubsub.to('download-finished', '')

  download.cancel().then(() => {
    toast.error(t('toast.cancelInDowload'))
  })
}
</script>
