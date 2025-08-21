export interface HeaderTabItem {
  icon: string
  title: string
  url: string
  search: string
  loaded: boolean
  id: string
}

interface NavigatorLinkItem {
  url: string
}

export interface NavigatorState {
  oldLink: NavigatorLinkItem
  actuallyLink: NavigatorLinkItem
  stateLink: NavigatorLinkItem & { loadedURL: 'default' | 'loading' | 'webview' }
  activeTab: number
  lastTab: number
  views: HeaderTabItem[]
}

export interface OptionsState {
  searchProvider: 'google' | 'bing' | 'duckduckgo' | 'empty'
}

export interface HistoryState {
  list: {
    title: string
    url: string
  }[]
}
