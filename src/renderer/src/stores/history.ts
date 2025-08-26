import { HistoryState } from '@/types'
import { defineStore } from 'pinia'

export const useHistoryStore = defineStore('history', {
  state: () => {
    return {
      search: [],
      favorites: [],
      downloads: [],
      downloadsInProgress: []
    } as HistoryState
  }
})
