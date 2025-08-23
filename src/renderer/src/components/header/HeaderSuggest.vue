<template>
  <section
    class="flex flex-col absolute bg-secondary top-20 left-18 w-70% max-h-45 overflow-y-auto overflow-x-hidden rounded-lg"
  >
    <div
      v-for="item in historyFiltered"
      class="flex justify-between transition-colors hover:bg-primary border-b-black border-2 py-2 raleway items-center gap-5 w-full p-2"
    >
      <div @click="onGoSuggest(item.url)" class="flex items-center cursor-pointer gap-5">
        <h2 class="text-white max-w-50% truncate text-base">{{ item.title }}</h2>
        <p class="text-white truncate text-sm">{{ item.url }}</p>
      </div>
      <IconTabClose @click="onGoRemove(item)" class="h-5 w-5 text-white cursor-pointer" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useNavigatorStore } from '../../stores/navigator'
import { computed, ref } from 'vue'
import { usePubsub } from 'vue-pubsub'
import { useHistoryStore } from '../../stores/history'

const NAVIGATOR = useNavigatorStore()
const HISTORY = useHistoryStore()

const pubsub = usePubsub()

const showSuggest = ref<boolean>(false)

const historyFiltered = computed(() =>
  HISTORY.search
    .filter((item) => item.url.toLowerCase().includes(NAVIGATOR.actuallyLink.url.toLowerCase()))
    .filter((value, index, self) => index === self.findIndex((t) => t.url === value.url))
)

const onGoSuggest = (url: string) => {
  showSuggest.value = false

  pubsub.to('load-view-from-url', url)
}

const onGoRemove = (item: { title: string; url: string }) => {
  HISTORY.search = HISTORY.search.filter((target) => target.url !== item.url)
}
</script>
