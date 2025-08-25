<template>
  <section
    class="flex flex-col raleway absolute bg-secondary top-20 right-15 w-70 max-h-45 overflow-y-auto overflow-x-hidden rounded-lg"
  >
    <p class="text-white p-3 text-lg">Downloads</p>
    <div
      v-if="HISTORY.downloadInProgress"
      class="flex items-center p-3 justify-between border border-b-2 border-gray gap-2 w-full pb-10"
    >
      <div class="flex gap-2 items-center">
        <img
          v-if="HISTORY.downloadInProgress.icon"
          :src="HISTORY.downloadInProgress.icon"
          alt="download icon"
        />
        <HeaderDownloadsExtIcon v-else :extension="HISTORY.downloadInProgress.ext" />
        <p class="text-white truncate">{{ HISTORY.downloadInProgress.filename }}</p>
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
import { usePath } from '@/use/path'
import { usePubsub } from 'vue-pubsub'

const HISTORY = useHistoryStore()

const path = usePath()
const pubsub = usePubsub()

const onOpen = (filepath: string) => {
  pubsub.to('download-finished', '')

  path.openFolder(filepath).catch(() => {})
}
</script>
