<template>
  <RouterView />
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
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

const CONTROLLER = useController()
const HISTORY = useHistoryStore()

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
    pubsub.to('download-started', '')

    const extract = utils.getExtensionFromFilename(data.filename)

    console.log(data.filename, extract)

    HISTORY.downloadInProgress = {
      ...data,
      ...extract[0],
      id: uuidv4(),
      date: date.getCommonDate(),
      savePath: '',
      receivedBytes: 0,
      totalBytes: 0
    }
  })

  window.api.onDownloadItemUpdated((data) => {
    if (HISTORY.downloadInProgress) {
      HISTORY.downloadInProgress.receivedBytes = data.receivedBytes
      HISTORY.downloadInProgress.totalBytes = data.totalBytes
    }
  })

  window.api.onDownloadItemDone(({ state, path }) => {
    if (HISTORY.downloadInProgress && state === 'completed') {
      HISTORY.downloads.unshift({
        id: HISTORY.downloadInProgress.id,
        filename: HISTORY.downloadInProgress.filename,
        icon: HISTORY.downloadInProgress.icon,
        ext: HISTORY.downloadInProgress.ext,
        mime: HISTORY.downloadInProgress.mime,
        date: HISTORY.downloadInProgress.date,
        savePath: path
      })

      HISTORY.downloadInProgress = undefined

      toast.success(t('toast.successInDowload'))

      return
    }

    pubsub.to('download-finished', '')
  })
})
</script>
