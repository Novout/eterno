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
    noticesInHomePage: boolean
    noticesInHomePageLink: string
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

export interface HistoryDownloadsMain {
  filename: string
  icon: string | false
}

export type HistoryDownloads = HistoryDownloadsMain & {
  id: string
  ext: string
  mime: string
  date: string
  savePath: string
}

export type HistoryDownloadsProgress = HistoryDownloads & {
  receivedBytes: number
  totalBytes: number
  isPaused: boolean
}

export interface HistorySearchItem {
  title: string
  url: string
  date: string
  icon: string
  folder: HistorySearchItem[]
}

export type HistoryFavoriteItem = HistorySearchItem

export interface HistoryState {
  search: HistorySearchItem[]
  favorites: HistoryFavoriteItem[]
  downloads: HistoryDownloads[]
  downloadsInProgress: HistoryDownloadsProgress[]
}
