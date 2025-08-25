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

    const [extract] = utils.getExtensionFromFilename(data.filename)

    HISTORY.downloadInProgress = {
      ...data,
      ...extract,
      date: date.getCommonDate(),
      savePath: ''
    }
  })

  window.api.onDownloadItemDone(({ state, path }) => {
    if (HISTORY.downloadInProgress && state === 'completed') {
      HISTORY.downloads.unshift({
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
