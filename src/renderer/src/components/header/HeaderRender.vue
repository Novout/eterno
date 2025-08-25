<template>
  <header class="flex flex-col justify-start items-center w-full h-30 bg-primary">
    <div class="flex items-center w-full bg-tertiary h-10 p-0">
      <draggable
        class="list-group flex p-0 max-w-96%"
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
        v-if="HISTORY.favorites.find((item) => item.url === NAVIGATOR.actuallyLink.url)"
        class="w-6 h-6 text-white cursor-pointer"
      />
      <IconFavoriteOff
        v-else
        @click.prevent.stop="onFavorite"
        class="w-6 h-6 text-white cursor-pointer"
      />
      <IconProfileDownload
        @click.prevent.stop="onToggleDownloads"
        class="w-6 h-6 text-white cursor-pointer"
      />
      <IconProfileMin
        @click.prevent.stop="onToggleProfile"
        class="w-6 h-6 text-white cursor-pointer"
      />
      <IconMenu @click.prevent.stop="onToggleMenu" class="w-5 h-5 text-white cursor-pointer" />
    </div>
    <teleport to="body">
      <HeaderSuggest v-if="showSuggest" />
      <HeaderProfile v-if="showProfile" />
      <HeaderMenu v-if="showMenu" />
      <HeaderDownloads v-if="showDownloads" />
    </teleport>
    <HeaderFavoriteBar />
  </header>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { HeaderTabItem } from '@/types'
import { useNavigatorStore } from '@/stores/navigator'
import { WebviewTag } from 'electron/renderer'
import { onMounted, ref } from 'vue'
import { usePubsub } from 'vue-pubsub'
import { useI18n } from 'vue-i18n'
import { useEventListener } from '@vueuse/core'
import draggable from 'vuedraggable'
import { useSearchProvider } from '@/use/searchProvider'
import { useHistoryStore } from '@/stores/history'
import { useDate } from '@/use/date'

const pubsub = usePubsub()
const { t } = useI18n()
const date = useDate()
const searchProvider = useSearchProvider()

const NAVIGATOR = useNavigatorStore()
const HISTORY = useHistoryStore()

const input = ref<HTMLInputElement | null>(null)

const showSuggest = ref<boolean>(false)
const showProfile = ref<boolean>(false)
const showMenu = ref<boolean>(false)
const showDownloads = ref<boolean>(false)

const getRender = (id?: number) => {
  return document.querySelector<WebviewTag>(
    `#__render_${NAVIGATOR.views[id || NAVIGATOR.activeTab].id}`
  )
}

pubsub.on('load-view-from-url', (url: any) => {
  onSearch(url)
})

pubsub.on('load-view-from-historic', (url: any) => {
  onAddPage()

  onSearch(url)
})

pubsub.on('load-view-from-start-browser', () => {
  const url = NAVIGATOR.views[NAVIGATOR.activeTab].url

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

pubsub.on('download-started', () => {
  showDownloads.value = true
})

pubsub.on('download-finished', () => {
  showDownloads.value = false
})

onMounted(() => {
  useEventListener(input, 'focus', () => {
    setTimeout(() => {
      input.value?.select()
    }, 100)
  })

  useEventListener(input, 'input', () => {
    if (!NAVIGATOR.actuallyLink.url) {
      showSuggest.value = false

      return
    }

    showSuggest.value = true
  })
})

const onToggleMenu = () => {
  showMenu.value = !showMenu.value
  showProfile.value = false
  showDownloads.value = false
}

const onToggleProfile = () => {
  showProfile.value = !showProfile.value
  showMenu.value = false
  showDownloads.value = false
}

const onToggleDownloads = () => {
  showDownloads.value = !showDownloads.value
  showProfile.value = false
  showMenu.value = false
}

const onUnfavorite = () => {
  HISTORY.favorites = HISTORY.favorites.filter(
    (item) => item.url && item.url !== NAVIGATOR.actuallyLink.url
  )
}

const onFavorite = () => {
  const url = NAVIGATOR.actuallyLink.url

  try {
    HISTORY.favorites.push({
      title: getRender()?.getTitle() || NAVIGATOR.views[NAVIGATOR.activeTab].title,
      icon: searchProvider.getFavicon(url),
      url,
      date: '',
      folder: []
    })
  } catch (e) {}
}

const onDragChange = ({ moved }) => {
  if (NAVIGATOR.activeTab === moved.oldIndex) {
    NAVIGATOR.activeTab = moved.newIndex
  }
}

const onSearch = (url?: string) => {
  showSuggest.value = false

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
    loadedFavicon: true,
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

const onLoadURL = (target?: string) => {
  if (!target) return

  let view = NAVIGATOR.views[NAVIGATOR.activeTab]

  if (!view) {
    view = NAVIGATOR.views[0]
    NAVIGATOR.activeTab = 0
  }

  const render = getRender()

  const getActuallyIndex = () => {
    const item = NAVIGATOR.views.find((item) => item.id === view.id)

    if (!item) return -1

    return NAVIGATOR.views.indexOf(item)
  }

  if (!view.loaded) {
    setTimeout(() => {
      render?.loadURL(url).catch(({ message }) => {
        if (message.indexOf('GUEST_VIEW_MANAGER_CALL') > -1) {
          // TODO: Reload page
        }
      })
    }, 200)

    NAVIGATOR.views[getActuallyIndex()].loaded = true
    NAVIGATOR.views[getActuallyIndex()].loadedFavicon = false

    const onUpdateTab = (url?: string) => {
      const callback = NAVIGATOR.views[getActuallyIndex()]

      setTimeout(() => {
        try {
          const target = url || render?.getURL()

          if (!target || target === callback.url) return

          onRefreshURL(callback.id, target)
        } catch (e) {}
      }, 200)
    }

    render?.addEventListener('did-start-loading', () => {
      onUpdateTab()
    })

    render?.addEventListener('did-finish-load', () => {
      try {
        const activeTitle = render?.getTitle() || NAVIGATOR.views[getActuallyIndex()].title
        const activeUrl = render?.getURL() || url

        if (
          activeTitle !== t('views.default.title') ||
          NAVIGATOR.stateLink.loadedURL !== 'default'
        ) {
          HISTORY.search.unshift({
            title: activeTitle,
            url: activeUrl,
            date: date.getCommonDate(),
            icon: searchProvider.getFavicon(url),
            folder: []
          })
        }

        NAVIGATOR.views[getActuallyIndex()].loadedFavicon = true

        onUpdateTab(activeUrl)
      } catch (e) {}
    })

    render?.addEventListener('page-title-updated', ({ title }) => {
      NAVIGATOR.views[getActuallyIndex()].title = title
    })
  }

  const url = searchProvider.getCorrectSearchURL(target)
  const icon = searchProvider.getFavicon(url)

  NAVIGATOR.views[getActuallyIndex()].icon = icon
  NAVIGATOR.views[getActuallyIndex()].url = url

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

      NAVIGATOR.views[index].title = title
      NAVIGATOR.views[index].icon = searchProvider.getFavicon(url)
    } catch (e) {}
    NAVIGATOR.actuallyLink.url = url
  }
}

const onLoadTab = (
  tab: HeaderTabItem,
  options: {
    removed?: boolean
    force?: boolean
  }
) => {
  const target = NAVIGATOR.views.indexOf(tab)

  NAVIGATOR.stateLink.loadedURL = tab.title === t('views.default.title') ? 'default' : 'webview'
  NAVIGATOR.lastTab = options.removed ? NAVIGATOR.lastTab : NAVIGATOR.activeTab

  const last = NAVIGATOR.views[NAVIGATOR.activeTab]

  if (last) NAVIGATOR.views[NAVIGATOR.activeTab].search = NAVIGATOR.actuallyLink.url
  NAVIGATOR.activeTab = target
  NAVIGATOR.actuallyLink.url = tab.search

  if (options.force) onLoadURL(tab.url)
}

const onCloseTab = (tab: HeaderTabItem) => {
  const index = NAVIGATOR.views.indexOf(tab)
  NAVIGATOR.views = NAVIGATOR.views.filter((_tab) => tab !== _tab)

  if (NAVIGATOR.views.length === 0) {
    // TODO: CLose application
    return
  }

  let target = NAVIGATOR.views[NAVIGATOR.lastTab]

  if (!target || !target.title) target = NAVIGATOR.views[0]

  const isActiveTabRemoved = NAVIGATOR.activeTab === index

  if (isActiveTabRemoved) {
    onLoadTab(target, {
      removed: true,
      force: true
    })
  }
}
</script>
