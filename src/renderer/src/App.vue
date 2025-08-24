<template>
  <RouterView />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useData } from './use/data'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { useController } from './use/controller'
import { usePubsub } from 'vue-pubsub'

const CONTROLLER = useController()

const data = useData()
const toast = useToast()
const pubsub = usePubsub()
const { t } = useI18n()

onMounted(() => {
  data
    .get('main')
    .then((values) => {
      if (values && typeof values !== 'string') CONTROLLER.init(values)
      else {
        pubsub.to('add-first-page', '')
      }
    })
    .catch(() => {
      toast.error(t('toast.errorInInitializeData'))
    })

  // TODO: temporary auto-save data
  setTimeout(() => {
    CONTROLLER.save()
  }, 1000 * 10)
})

onUnmounted(() => {
  CONTROLLER.save()
})
</script>
