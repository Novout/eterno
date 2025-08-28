<template>
  <div
    class="flex w-full gap-2 items-center overflow-x-auto overflow-y-hidden"
    v-if="HISTORY.favorites.length > 0"
  >
    <draggable
      class="list-group flex gap-2 max-w-20"
      item-key="order"
      tag="transition-group"
      :component-data="{ tag: 'ul', name: 'flip-list', type: 'transition' }"
      v-model="HISTORY.favorites"
    >
      <template #item="{ element }">
        <div
          :class="[
            HISTORY.favorites.length < 4
              ? 'max-w-60'
              : HISTORY.favorites.length < 6
                ? 'max-w-50'
                : HISTORY.favorites.length < 8
                  ? 'max-w-36'
                  : HISTORY.favorites.length < 10
                    ? 'max-w-28'
                    : HISTORY.favorites.length < 12
                      ? 'max-w-12'
                      : HISTORY.favorites.length < 15
                        ? 'max-w-10'
                        : 'max-w-6'
          ]"
          @click="pubsub.to('load-view-from-url', element.url)"
          class="flex cursor-pointer gap-2 px-2 transition-colors hover:bg-secondary"
        >
          <div
            @click="pubsub.to('load-view-from-url', element.url)"
            class="flex items-center gap-2"
            v-if="!element?.items"
          >
            <img class="w-6 h-6" :src="element.icon" alt="site icon" />
            <h2 class="text-base text-white truncate">{{ element.title }}</h2>
          </div>
          <div @click="onOpenFolder(element)" class="flex items-center gap-2" v-else>
            <IconDirectory class="text-white h-6 w-6" />
            <h2 class="text-base text-white truncate">{{ element.title }}</h2>
          </div>
          <teleport to="body">
            <div
              :style="{ left: `${width / 2 - 240}px`, top: `${height / 2 - 160}px` }"
              class="absolute raleway rounded-lg bg-primary flex flex-col gap-2 w-120 max-h-80 overflow-y-auto"
              v-if="showFolder"
            >
              <div class="flex p-2 items-center justify-between w-full">
                <p class="text-lg text-white">{{ element.title }}</p>
                <IconTabClose
                  @click="onClose"
                  class="w-6 h-6 text-gray cursor-pointer hover:text-white transition-colors"
                />
              </div>
              <div
                class="flex flex-col gap-2 w-full"
                v-if="folder"
                v-for="(item, index) in folder.items"
                :key="index"
              >
                <div
                  class="flex gap-2 p-2 w-full items-center cursor-pointer hover:bg-secondary transition-colors"
                  @click="onOpenFavorite(item.url)"
                >
                  <img v-if="item.icon" class="w-6 h-6" :src="item.icon" alt="site icon" />
                  <h2 class="text-base text-white truncate">{{ item.title }}</h2>
                </div>
              </div>
            </div>
          </teleport>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import { usePubsub } from 'vue-pubsub'
import draggable from 'vuedraggable'
import { useHistoryStore } from '@/stores/history'
import { ref } from 'vue'
import { HistoryFolderItem } from '@/types'
import { useWindowSize } from '@vueuse/core'

const HISTORY = useHistoryStore()

const pubsub = usePubsub()
const { width, height } = useWindowSize()

const showFolder = ref<boolean>(false)
const folder = ref<HistoryFolderItem | undefined>(undefined)

// TODO: resolve @click.rigth problem
/*
const onRemoveFolderItem = (search: HistorySearchItem, folder: HistoryFolderItem) => {
  const target = HISTORY.favorites.find((item) => item.title === folder.title)

  if (target) {
    const index = HISTORY.favorites.indexOf(target)

    // @ts-ignore
    HISTORY.favorites[index].items =
      // @ts-ignore
      HISTORY.favorites[index].items.filter((item) => item.title !== search.title) || []
  }
}

const onRemove = (favorite: HistoryFavoriteItem) => {
  showFolder.value = false

  const index = HISTORY.favorites.indexOf(favorite)
  // @ts-ignore
  if (favorite?.items && index) {
    // @ts-ignore
    HISTORY.favorites[index].items =
      // @ts-ignore
      HISTORY.favorites[index].items.filter((item) => item.title !== favorite.title) || []

    return
  }
}
*/

const onClose = () => {
  showFolder.value = false
  folder.value = undefined
}

const onOpenFolder = (item) => {
  folder.value = item

  showFolder.value = !showFolder.value
}

const onOpenFavorite = (url: string) => {
  pubsub.to('load-view-from-url', url)

  showFolder.value = false
}
</script>
