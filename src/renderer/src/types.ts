export type DataKeys = 'initialize'

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

export interface ProfileState {
  name: string
  image?: string
  xp: {
    level: number
    level_amount: number
  }
  conquests: {}
}

export interface HistorySearchItem {
  title: string
  url: string
  date: string
}

export interface HistoryFavItem {
  title: string
  url: string
  icon: string
}

export interface HistoryState {
  search: HistorySearchItem[]
  fav: HistoryFavItem[]
}
