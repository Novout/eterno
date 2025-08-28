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
import { useOptionsStore } from './stores/options'
import { Data } from './types'

const CONTROLLER = useController()
const HISTORY = useHistoryStore()
const OPTIONS = useOptionsStore()

const data = useData()
const date = useDate()
const toast = useToast()
const pubsub = usePubsub()
const env = useEnv()
const { t } = useI18n()
const utils = useUtils()

onMounted(() => {
  data
    .get('main')
    .then((values) => {
      if (!env.isDev() && values && typeof values !== 'string' && OPTIONS.defines.saveLocalData)
        CONTROLLER.init(values as Data)
      else {
        pubsub.to('add-first-page', '')

        // for deploy build
        data.remove('main').catch(() => {})
      }
    })
    .catch(() => {
      toast.error(t('toast.errorInInitializeData'))
    })

  // TODO: temporary auto-save data
  setTimeout(() => {
    if (OPTIONS.defines.saveLocalData) CONTROLLER.save()
  }, 1000 * 3)

  window.api.onOpenNewView((url) => {
    pubsub.to('load-view-from-target-link', url)
  })

  window.api.onDownloadItemStart((data) => {
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
    const item = HISTORY.downloadsInProgress.find((item) => item.id === data.id)

    if (item) {
      const target = HISTORY.downloadsInProgress.indexOf(item)

      HISTORY.downloadsInProgress[target].receivedBytes = data.receivedBytes
      HISTORY.downloadsInProgress[target].totalBytes = data.totalBytes
    }
  })

  window.api.onDownloadItemDone(({ state, path, id }) => {
    if (state === 'completed') {
      const item = HISTORY.downloadsInProgress.find((item) => item.id === id)

      if (item) {
        const target = HISTORY.downloadsInProgress.indexOf(item)

        HISTORY.downloads.unshift({
          id: HISTORY.downloadsInProgress[target].id,
          filename: HISTORY.downloadsInProgress[target].filename,
          icon: HISTORY.downloadsInProgress[target].icon,
          ext: HISTORY.downloadsInProgress[target].ext,
          mime: HISTORY.downloadsInProgress[target].mime,
          date: HISTORY.downloadsInProgress[target].date,
          savePath: path
        })

        HISTORY.downloadsInProgress = HISTORY.downloadsInProgress.filter(
          (download) => download.id !== id
        )

        toast.success(t('toast.successInDownload'))

        return
      }
    }

    pubsub.to('download-finished', '')
  })
})
</script>
