<template>
  <RouterView />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useData } from './use/data'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { useController } from './use/controller'
import { usePubsub } from 'vue-pubsub'
import { useEnv } from './use/env'
import { useHistoryStore } from './stores/history'
import { useUtils } from './use/utils'
import { useDate } from './use/date'
import { useDownload } from './use/download'

const CONTROLLER = useController()
const HISTORY = useHistoryStore()

const data = useData()
const date = useDate()
const toast = useToast()
const pubsub = usePubsub()
const env = useEnv()
const { t } = useI18n()
const utils = useUtils()
const download = useDownload()

onMounted(() => {
  data
    .get('main')
    .then((values) => {
      if (!env.isDev() && values && typeof values !== 'string') CONTROLLER.init(values)
      else {
        pubsub.to('add-first-page', '')

        // because for deploy build
        data.remove('main').catch(() => {})
      }
    })
    .catch(() => {
      toast.error(t('toast.errorInInitializeData'))
    })

  // TODO: temporary auto-save data
  setTimeout(() => {
    CONTROLLER.save()
  }, 1000 * 3)

  window.api.onDownloadItemStart((data) => {
    if (HISTORY.downloadsInProgress.find((item) => item.id === data.id)) {
      download
        .cancel(data.id)
        .then(() => {
          toast.warning(t('toast.warningInDuplicateDownload'))
        })
        .catch(() => {})

      return
    }

    pubsub.to('download-started', '')

    const [extensions] = utils.getExtensionFromFilename(data.filename)

    HISTORY.downloadsInProgress?.unshift({
      ...data,
      ...extensions,
      date: date.getCommonDate(),
      savePath: '',
      receivedBytes: 0,
      totalBytes: 0,
      isPaused: false
    })
  })

  window.api.onDownloadItemUpdated((data) => {
    if (HISTORY.downloadsInProgress) {
      const index = HISTORY.downloadsInProgress.find((item) => item.id === data.id)

      if (index) {
        const target = HISTORY.downloadsInProgress.indexOf(index)

        HISTORY.downloadsInProgress[target].receivedBytes = data.receivedBytes
        HISTORY.downloadsInProgress[target].totalBytes = data.totalBytes
      }
    }
  })

  window.api.onDownloadItemDone(({ state, path, id }) => {
    if (HISTORY.downloadsInProgress && state === 'completed') {
      HISTORY.downloads.unshift({
        id: HISTORY[id].downloadInProgress.id,
        filename: HISTORY[id].downloadInProgress.filename,
        icon: HISTORY[id].downloadInProgress.icon,
        ext: HISTORY[id].downloadInProgress.ext,
        mime: HISTORY[id].downloadInProgress.mime,
        date: HISTORY[id].downloadInProgress.date,
        savePath: path
      })

      HISTORY.downloadsInProgress = HISTORY.downloadsInProgress.filter(
        (download) => download.id !== id
      )

      toast.success(t('toast.successInDownload'))

      return
    }

    pubsub.to('download-finished', '')
  })
})
</script>
