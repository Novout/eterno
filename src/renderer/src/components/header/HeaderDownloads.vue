<template>
  <section
    class="flex flex-col raleway absolute bg-secondary top-20 right-15 w-70 max-h-45 overflow-y-auto overflow-x-hidden rounded-lg"
  >
    <p class="text-white p-3 text-lg">Downloads</p>
    <div
      v-if="HISTORY.downloadsInProgress.length !== 0"
      v-for="(download, index) in HISTORY.downloadsInProgress"
      :key="index"
      class="flex flex-col gap-5 w-full"
    >
      <div
        class="flex flex-col gap-3 items-center p-3 justify-between border border-b-2 border-gray gap-2 w-full"
      >
        <div class="flex w-full justify-between items-center">
          <div class="flex items-center gap-2">
            <img v-if="download.icon" :src="download.icon" alt="download icon" />
            <HeaderDownloadsExtIcon v-else :extension="download.ext" />
            <p class="text-white truncate">{{ download.filename }}</p>
          </div>
          <div class="flex items-center gap-2">
            <IconPause
              v-if="!download.isPaused"
              class="w-5 h-5 text-gray hover:text-white transition-colors cursor-pointer"
              @click="onPauseDownload(download)"
            />
            <IconResume
              v-else
              class="w-5 h-5 text-gray hover:text-white transition-colors cursor-pointer"
              @click="onResumeDownload(download)"
            />
            <IconTabClose
              class="w-5 h-5 text-gray hover:text-white transition-colors cursor-pointer"
              @click="onCancelDownload(download)"
            />
          </div>
        </div>
        <div class="w-full h-3 bg-primary rounded-full shadow-lg">
          <div
            class="h-3 bg-primary-colored rounded-full"
            :style="{
              width: `${((download.receivedBytes / download.totalBytes) * 100).toFixed(2)}%`
            }"
          />
        </div>
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
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { HistoryDownloadsProgress } from '@/types'

const HISTORY = useHistoryStore()

const path = usePath()
const pubsub = usePubsub()
const download = useDownload()
const toast = useToast()
const { t } = useI18n()

const onOpen = (filepath: string) => {
  pubsub.to('download-finished', '')

  path.openFolder(filepath).catch(() => {
    toast.error(t('toast.errorInOpenFolder'))
  })
}

const onResumeDownload = (item: HistoryDownloadsProgress) => {
  item.isPaused = false

  download.resume(item.id)
}

const onPauseDownload = (item: HistoryDownloadsProgress) => {
  item.isPaused = true

  download.pause(item.id)
}

const onCancelDownload = (item: HistoryDownloadsProgress) => {
  HISTORY.downloadsInProgress = HISTORY.downloadsInProgress.filter(
    (download) => download.id !== item.id
  )

  if (HISTORY.downloadsInProgress.length === 0) {
    pubsub.to('download-finished', '')
  }

  item.isPaused = false

  download.cancel(item.id).then(() => {
    toast.error(t('toast.cancelInDownload'))
  })
}
</script>
