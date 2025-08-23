<template>
  <RouterView />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useData } from './use/data'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { useController } from './use/controller'

const CONTROLLER = useController()

const data = useData()
const toast = useToast()
const { t } = useI18n()

onMounted(() => {
  data
    .get('initialize')
    .then((values) => {
      if (values && typeof values !== 'string') CONTROLLER.init(values)
    })
    .catch(() => {
      toast.error(t('toast.errorInInitializeData'))
    })
})

onUnmounted(() => {
  CONTROLLER.close()
})
</script>
