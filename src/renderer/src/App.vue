<template>
  <RouterView />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useData } from './use/data'
import { useSharedStore } from './stores/shared'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { usePubsub } from 'vue-pubsub'

const SHARED = useSharedStore()

const data = useData()
const toast = useToast()
const pubsub = usePubsub()
const { t } = useI18n()

onMounted(() => {
  data
    .get('initialize')
    .then((values) => {
      if (values && typeof values !== 'string') SHARED.start(values)

      pubsub.to('add-first-page', '')
    })
    .catch(() => {
      toast.error(t('toast.errorInInitializeData'))
    })
})

onUnmounted(() => {
  SHARED.save()
})
</script>
