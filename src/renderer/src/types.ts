export type DataKeys = 'main'

export interface HeaderTabItem {
  icon: string
  title: string
  url: string
  search: string
  loaded: boolean
  loadedFavicon: boolean
  id: string
}

interface NavigatorLinkItem {
  url: string
}

export interface NavigatorState {
  oldLink: NavigatorLinkItem
  actuallyLink: NavigatorLinkItem
  stateLink: NavigatorLinkItem & { loadedURL: 'default' | 'webview' }
  activeTab: number
  lastTab: number
  views: HeaderTabItem[]
}

export interface OptionsState {
  preferences: {
    searchProvider: 'google' | 'bing' | 'duckduckgo' | 'empty'
    language: 'Português do Brasil' | 'English'
  }
}

export interface ProfileState {
  name: string
  image?: string
  xp: {
    level: number
    level_amount: number
  }
  conquests: {}
}

export interface HistoryItem {
  title: string
  url: string
  date: string
  icon: string
}

export interface HistoryState {
  search: HistoryItem[]
  fav: HistoryItem[]
}
