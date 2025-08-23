<template>
  <section
    ref="profile"
    class="flex flex-col p-5 gap-5 absolute bg-secondary top-20 right-5 w-70 max-h-60 overflow-y-auto overflow-x-hidden rounded-lg"
  >
    <div class="flex w-full items-center gap-5">
      <img v-if="PROFILE.image" :src="PROFILE.image" alt="profile image" />
      <IconProfile v-else class="text-white h-15 w-15" />
      <h2 class="raleway-bold text-lg text-white">{{ PROFILE.name || 'Guest' }}</h2>
    </div>
    <div class="flex flex-col w-full text-white text-lg raleway">
      <p>Level {{ PROFILE.xp.level }}</p>
    </div>
    <div class="flex flex-col w-full">
      <p class="text-white raleway">{{ t('profile.conquests') }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useProfileStore } from '@/stores/profile'

const PROFILE = useProfileStore()

const { t } = useI18n()
</script>
