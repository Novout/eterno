<template>
  <header class="flex flex-col justify-start items-center w-full h-30 bg-primary">
    <div class="flex items-center w-full bg-tertiary h-10">
      <HeaderTab @close="onCloseTab" @load="onLoadTab" :class="[NAVIGATOR.views[NAVIGATOR.activeTab] !== tab ? 'bg-secondary hover:bg-tab-focus' : 'bg-primary']" v-for="tab in NAVIGATOR.views" :tab="tab" />
      <IconAdd @click="onAddPage" class="h-6 w-6 text-white cursor-pointer pl-2" />
    </div>
    <div class="flex w-full items-center gap-2 p-2">
      <IconBack @click="onBackPage" class="text-white w-6 h-6 cursor-pointer" />
      <IconReload @click="onReloadPage" class="text-white w-6 h-6 cursor-pointer" />
      <input ref="input" @keyup.enter="onSearch" class="bg-secondary rounded-xl text-white border-gray border-solid border-1 border-none h-8 p-2 w-full" type="text" v-model="NAVIGATOR.actuallyLink.url" autocomplete="true" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import { useRegex } from '../../use/regex'
import { HeaderTabItem } from '../../types';
import { useOptionsStore } from '../../stores/options';
import { useNavigatorStore } from '../../stores/navigator';
import { WebviewTag } from 'electron/renderer';
import { ref } from 'vue';

const regex = useRegex()

const OPTIONS = useOptionsStore()
const NAVIGATOR = useNavigatorStore()

const input = ref<HTMLInputElement | null>(null)

const getRender = () => {
  return document.querySelector<WebviewTag>(`#__render_${NAVIGATOR.views[NAVIGATOR.activeTab].id}`)
}

const onSearch = () => {
  const target = NAVIGATOR.actuallyLink.url

  onLoadURL(target)
}

const onReloadPage = () => {
  getRender()?.reload()
}

const onBackPage = () => {
  getRender()?.goBack()
}

const onAddPage = () => {
  NAVIGATOR.views.push({
    icon: '',
    title: 'Eterno',
    url: '',
    search: 'Eterno',
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

const onLoadURL = (target?: string) => {
  if(!target) return

  let url = target

  if(!regex.validateUrl(target)) {
    if(OPTIONS.searchProvider === 'google') {
      url = `https://www.google.com/search?q=${target}`
    }
  }

  let view = NAVIGATOR.views[NAVIGATOR.activeTab]

  if(!view) {
    view = NAVIGATOR.views[0]
    NAVIGATOR.activeTab = 0
  }

  if(!view.loaded) {
    setTimeout(() => {
      getRender()?.loadURL(url)
    }, 200)

    NAVIGATOR.views[NAVIGATOR.activeTab].loaded = true
  }

  const cleanUrl = (url: string): string => {
  // url에서 호스트만 추출한다.
    let cleanedUrl = url.includes("https")
      ? url.slice(8)
      : url.includes("http") && url.slice(7);

    if(!cleanedUrl) return ''

    return cleanedUrl.includes("/") ? cleanedUrl.split("/")[0] : cleanedUrl;
  };

  NAVIGATOR.views[NAVIGATOR.activeTab].icon = `http://www.google.com/s2/favicons?domain=${cleanUrl(url)}`
  NAVIGATOR.views[NAVIGATOR.activeTab].url = url

  NAVIGATOR.stateLink.url = url
  NAVIGATOR.actuallyLink.url = url
  NAVIGATOR.stateLink.loadedURL = 'webview'

}

const onLoadTab = (tab: HeaderTabItem, removed?: boolean) => {
  const target = NAVIGATOR.views.indexOf(tab)

  NAVIGATOR.stateLink.loadedURL = tab.title === 'Eterno' ? 'default' : 'loading'
  NAVIGATOR.lastTab = removed ? 0 : NAVIGATOR.activeTab

  const last = NAVIGATOR.views[NAVIGATOR.activeTab]

  if(last) NAVIGATOR.views[NAVIGATOR.activeTab].search = NAVIGATOR.actuallyLink.url
  NAVIGATOR.activeTab = target
  NAVIGATOR.actuallyLink.url = tab.search

  onLoadURL(tab.url)
}

const onCloseTab = (tab: HeaderTabItem) => {
  NAVIGATOR.views = NAVIGATOR.views.filter(_tab => tab !== _tab)

  if(NAVIGATOR.views.length === 0) {
    // TODO: CLose application
    return
  }

  const target = NAVIGATOR.views[NAVIGATOR.lastTab]

  onLoadTab(target, true)
}
</script>
