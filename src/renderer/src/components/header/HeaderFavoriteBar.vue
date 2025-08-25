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
      @start=""
      @change=""
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
          @click.right="
            HISTORY.favorites = HISTORY.favorites.filter((item) => item.url !== element.url)
          "
          class="flex cursor-pointer gap-2 px-2 transition-colors hover:bg-secondary"
        >
          <div class="flex items-center gap-2" v-if="element.folder.length === 0">
            <img class="w-6 h-6" :src="element.icon" alt="site icon" />
            <h2 class="text-base text-white truncate">{{ element.title }}</h2>
          </div>
          <div class="flex items-center gap-2" v-else>
            <IconDirectory class="text-white h-6 w-6" />
            <h2 class="text-base text-white truncate">{{ element.title }}</h2>
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import { usePubsub } from 'vue-pubsub'
import draggable from 'vuedraggable'
import { useHistoryStore } from '@/stores/history'
import IconDirectory from '../icons/IconDirectory.vue'

const HISTORY = useHistoryStore()

const pubsub = usePubsub()
</script>
