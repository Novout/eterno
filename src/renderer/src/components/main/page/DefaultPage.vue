<template>
  <div class="gradient flex gap-10 flex-col items-center webkit w-full">
    <img class="logo w-60 h-60 mt-10" src="../../../assets/logo.svg" alt="Eterno Logo" />
    <h1 class="poppins text-6xl">{{ t('default.title') }}</h1>
    <p class="poppins-light">{{ t('default.description') }}</p>
    <input
      :placeholder="t('default.placeholder')"
      class="w-50% h-12 px-5 py-2 shadow-lg text-lg rounded-2xl border border-black"
      @keyup.enter="onInput"
      v-model="input"
      type="text"
      autocomplete="true"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePubsub } from 'vue-pubsub'

const input = ref<string>('')

const pubsub = usePubsub()
const { t } = useI18n()

const onInput = () => {
  pubsub.to('load-view-from-url', input.value)
}
</script>

<style scoped>
.gradient {
  background: #d5d8e8;
  background: linear-gradient(148deg, rgba(213, 216, 232, 1) 0%, rgba(255, 230, 230, 1) 100%);
}

.logo {
  transition: transform 0.5s ease-in-out; /* Smooth transition for transform */
}

.logo:hover {
  transform: rotate(90deg); /* Rotates 90 degrees on hover */
}
</style>
