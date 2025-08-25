<template>
  <div class="gradient flex gap-2 flex-col items-center webkit w-full">
    <img class="logo w-60 h-60 my-10" src="../../../assets/logo.svg" alt="Eterno Logo" />
    <h1 class="poppins text-6xl">{{ t('default.title') }}</h1>
    <p class="poppins-light">{{ t('default.description') }}</p>
    <p class="poppins-light">v{{ env.getPackageVersion() }}</p>
    <input
      :placeholder="t('default.placeholder')"
      class="w-50% h-12 px-5 py-2 shadow-lg mt-10 text-lg rounded-2xl border border-black"
      @keyup.enter="onInput"
      v-model="input"
      type="text"
      autocomplete="true"
    />
  </div>
</template>

<script setup lang="ts">
import { useEnv } from '@/use/env'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePubsub } from 'vue-pubsub'

const input = ref<string>('')

const pubsub = usePubsub()
const env = useEnv()
const { t } = useI18n()

const onInput = () => {
  pubsub.to('load-view-from-url', input.value)
}
</script>

<style scoped>
.logo {
  transition: transform 0.5s ease-in-out;
}

.logo:hover {
  transform: rotate(90deg);
}
</style>
