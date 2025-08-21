<template>
  <header class="flex flex-col justify-start items-center w-full h-30 bg-primary">
    <div class="flex items-center w-full bg-tertiary h-10 p-0">
      <draggable
        class="list-group flex p-0"
        item-key="order"
        tag="transition-group"
        :component-data="{ tag: 'ul', name: 'flip-list', type: 'transition' }"
        v-model="NAVIGATOR.views"
        @start=""
        @change="onDragChange"
      >
        <template #item="{ element }">
          <HeaderTab
            @close="onCloseTab"
            @load="onLoadTab"
            :class="[
              NAVIGATOR.views[NAVIGATOR.activeTab] !== element
                ? 'bg-secondary hover:bg-tab-focus'
                : 'bg-primary'
            ]"
            :tab="element"
          />
        </template>
      </draggable>
      <div class="min-w-10 flex items-center justify-center">
        <IconAdd @click="onAddPage" class="h-5 w-5 text-white cursor-pointer" />
      </div>
    </div>
    <div class="flex w-full items-center gap-2 p-2">
      <IconBack @click="onSetState(true)" class="text-white w-6 h-6 cursor-pointer" />
      <IconReload @click="onReloadPage" class="text-white w-6 h-6 cursor-pointer" />
      <input
        ref="input"
        @keyup.enter="onSearch()"
        class="bg-secondary hover:bg-primary transition-colors rounded-xl text-white border-gray hover:border-white border-solid border-1 border-none h-8 p-2 w-full"
        type="text"
        v-model="NAVIGATOR.actuallyLink.url"
        autocomplete="true"
      />
      <IconFavoriteOn
        @click="onUnfavorite"
        v-if="HISTORY.fav.find((item) => item.url === NAVIGATOR.actuallyLink.url)"
        class="w-5 h-5 text-white cursor-pointer"
      />
      <IconFavoriteOff v-else @click="onFavorite" class="w-5 h-5 text-white cursor-pointer" />
    </div>
    <teleport to="body">
      <section
        v-if="showSuggest"
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
    </teleport>
    <div
      class="flex w-full gap-2 items-center overflow-x-auto overflow-y-hidden"
      v-if="HISTORY.fav.length > 0"
    >
      <draggable
        class="list-group flex gap-2 max-w-20"
        item-key="order"
        tag="transition-group"
        :component-data="{ tag: 'ul', name: 'flip-list', type: 'transition' }"
        v-model="HISTORY.fav"
        @start=""
        @change=""
      >
        <template #item="{ element }">
          <div
            :class="[
              HISTORY.fav.length < 4
                ? 'max-w-60'
                : HISTORY.fav.length < 6
                  ? 'max-w-50'
                  : HISTORY.fav.length < 8
                    ? 'max-w-36'
                    : HISTORY.fav.length < 10
                      ? 'max-w-28'
                      : HISTORY.fav.length < 12
                        ? 'max-w-12'
                        : HISTORY.fav.length < 15
                          ? 'max-w-10'
                          : 'max-w-6'
            ]"
            @click="onSearch(element.url)"
            class="flex cursor-pointer gap-2"
          >
            <img class="w-6 h-6" :src="element.icon" alt="site icon" />
            <h2 class="text-base text-white truncate">{{ element.title }}</h2>
          </div>
        </template>
      </draggable>
    </div>
  </header>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { HeaderTabItem } from '../../types'
import { useNavigatorStore } from '../../stores/navigator'
import { WebviewTag } from 'electron/renderer'
import { computed, onMounted, ref } from 'vue'
import { usePubsub } from 'vue-pubsub'
import { useI18n } from 'vue-i18n'
import { useEventListener } from '@vueuse/core'
import draggable from 'vuedraggable'
import { useSearchProvider } from '../../use/searchProvider'
import { useHistoryStore } from '../../stores/history'
import { format } from 'date-fns'

const pubsub = usePubsub()
const { t } = useI18n()
const searchProvider = useSearchProvider()

const NAVIGATOR = useNavigatorStore()
const HISTORY = useHistoryStore()

const input = ref<HTMLInputElement | null>(null)

const showSuggest = ref<boolean>(false)

const historyFiltered = computed(() =>
  HISTORY.search.filter((item) =>
    item.url.toLowerCase().includes(NAVIGATOR.actuallyLink.url.toLowerCase())
  )
)

const getRender = (id?: number) => {
  return document.querySelector<WebviewTag>(
    `#__render_${NAVIGATOR.views[id || NAVIGATOR.activeTab].id}`
  )
}

pubsub.on('load-view-from-url', (url: any) => {
  onSearch(url)
})

pubsub.on('add-first-page', () => {
  onAddPage()
})

pubsub.on('view-back-in-view', () => {
  onSetState(true)
})

pubsub.on('view-forward-in-view', () => {
  onSetState(false)
})

onMounted(() => {
  useEventListener(input, 'focus', () => {
    setTimeout(() => {
      input.value?.select()
    }, 100)
  })

  useEventListener(input, 'input', () => {
    if (!input.value?.value) return

    showSuggest.value = true
  })
})

const onUnfavorite = () => {
  HISTORY.fav = HISTORY.fav.filter((item) => item.url !== NAVIGATOR.actuallyLink.url)
}

const onFavorite = () => {
  const url = NAVIGATOR.actuallyLink.url

  try {
    HISTORY.fav.push({
      title: getRender()?.getTitle() || NAVIGATOR.views[NAVIGATOR.activeTab].title,
      icon: getFavicon(url),
      url
    })
  } catch (e) {}
}

const onGoSuggest = (url: string) => {
  showSuggest.value = false

  onSearch(url)
}

const onGoRemove = (item: { title: string; url: string }) => {
  HISTORY.search = HISTORY.search.filter((target) => target.url !== item.url)
}

const onDragChange = ({ moved }) => {
  if (NAVIGATOR.activeTab === moved.oldIndex) {
    NAVIGATOR.activeTab = moved.newIndex
  }
}

const onSearch = (url?: string) => {
  const target = url ?? NAVIGATOR.actuallyLink.url ?? ''

  onLoadURL(target)
}

const onReloadPage = () => {
  getRender()?.reload()
}

const onSetState = (back: boolean) => {
  const render = getRender()

  if (back) {
    if (render?.canGoBack()) render?.goBack()
  } else {
    if (render?.canGoForward()) render?.goForward()
  }

  setTimeout(() => {
    const url = getRender()?.getURL()
    const callback = NAVIGATOR.views[NAVIGATOR.activeTab]

    if (url) onRefreshURL(callback.id, url)
  }, 200)
}

const onAddPage = () => {
  NAVIGATOR.views.push({
    icon: '',
    title: t('views.default.title'),
    url: '',
    search: t('views.default.search'),
    loaded: false,
    id: uuidv4()
  })

  NAVIGATOR.views[NAVIGATOR.activeTab].search = NAVIGATOR.actuallyLink.url
  NAVIGATOR.lastTab = NAVIGATOR.activeTab
  NAVIGATOR.actuallyLink.url = ''
  NAVIGATOR.activeTab = NAVIGATOR.views.length - 1
  NAVIGATOR.stateLink.url = ''
  NAVIGATOR.stateLink.loadedURL = 'default'

  input.value?.focus()
}

const getFavicon = (_url: string) => {
  const cleanUrl = (url: string): string => {
    let cleanedUrl = url.includes('https') ? url.slice(8) : url.includes('http') && url.slice(7)

    if (!cleanedUrl) return ''

    return cleanedUrl.includes('/') ? cleanedUrl.split('/')[0] : cleanedUrl
  }

  return `http://www.google.com/s2/favicons?domain=${cleanUrl(_url)}`
}

const onLoadURL = (target?: string) => {
  const render = getRender()

  if (!target) return

  let view = NAVIGATOR.views[NAVIGATOR.activeTab]

  if (!view) {
    view = NAVIGATOR.views[0]
    NAVIGATOR.activeTab = 0
  }

  if (!view.loaded) {
    setTimeout(() => {
      render?.loadURL(url).catch(({ message }) => {
        if (message.indexOf('GUEST_VIEW_MANAGER_CALL') > -1) {
          // TODO: Reload page
        }
      })
    }, 200)

    NAVIGATOR.views[NAVIGATOR.activeTab].loaded = true

    const onUpdateTab = () => {
      const callback = NAVIGATOR.views[NAVIGATOR.activeTab]

      setTimeout(() => {
        try {
          const url = render?.getURL()

          if (!url || url === callback.url) return

          onRefreshURL(callback.id, url)
        } catch (e) {}
      }, 200)
    }

    render?.addEventListener('did-start-loading', () => {
      onUpdateTab()
    })

    render?.addEventListener('did-finish-load', () => {
      onUpdateTab()
    })

    render?.addEventListener('will-frame-navigate', () => {
      onUpdateTab()
    })

    render?.addEventListener('page-title-updated', ({ title }) => {
      NAVIGATOR.views[NAVIGATOR.activeTab].title = title
    })
  }

  const url = searchProvider.getCorrectSearchURL(target)

  NAVIGATOR.views[NAVIGATOR.activeTab].icon = getFavicon(url)
  NAVIGATOR.views[NAVIGATOR.activeTab].url = url

  try {
    const title = render?.getTitle() || NAVIGATOR.views[NAVIGATOR.activeTab].title

    if (!HISTORY.search.find((item) => item.url === url)) {
      HISTORY.search.push({ title, url, date: format(new Date(), 'MM/dd/yyyy h:mm a') })
    }
  } catch (e) {}

  NAVIGATOR.stateLink.url = url
  NAVIGATOR.actuallyLink.url = url
  NAVIGATOR.stateLink.loadedURL = 'webview'
}

const onRefreshURL = (_id: string, url: string) => {
  const tab = NAVIGATOR.views.find(({ id }) => id === _id)

  if (tab) {
    const index = NAVIGATOR.views.indexOf(tab)
    const render = getRender(index)

    try {
      const title = render?.getTitle() || NAVIGATOR.views[index].title

      if (!HISTORY.search.find((item) => item.url === url)) {
        HISTORY.search.push({ title, url, date: format(new Date(), 'MM/dd/yyyy h:mm a') })
      }

      NAVIGATOR.views[index].title = title
      NAVIGATOR.views[index].icon = getFavicon(url)
    } catch (e) {}
    NAVIGATOR.actuallyLink.url = url
  }
}

const onLoadTab = (tab: HeaderTabItem, removed?: boolean) => {
  const target = NAVIGATOR.views.indexOf(tab)

  NAVIGATOR.stateLink.loadedURL = tab.title === t('views.default.title') ? 'default' : 'loading'
  NAVIGATOR.lastTab = removed ? 0 : NAVIGATOR.activeTab

  const last = NAVIGATOR.views[NAVIGATOR.activeTab]

  if (last) NAVIGATOR.views[NAVIGATOR.activeTab].search = NAVIGATOR.actuallyLink.url
  NAVIGATOR.activeTab = target
  NAVIGATOR.actuallyLink.url = tab.search

  onLoadURL(tab.url)
}

const onCloseTab = (tab: HeaderTabItem) => {
  NAVIGATOR.views = NAVIGATOR.views.filter((_tab) => tab !== _tab)

  if (NAVIGATOR.views.length === 0) {
    // TODO: CLose application
    return
  }

  // update activeTab due to a mutation in the current id
  const actually = NAVIGATOR.views[NAVIGATOR.activeTab]
  const index = NAVIGATOR.views.indexOf(actually)
  NAVIGATOR.activeTab = index

  let target = NAVIGATOR.views[NAVIGATOR.lastTab]

  if (!target || !target.title) NAVIGATOR.views[0]

  onLoadTab(target, true)
}
</script>
