import { HistoryState } from '@/types'
import { defineStore } from 'pinia'

export const useHistoryStore = defineStore('history', {
  state: () => {
    return {
      search: [],
      fav: [],
      downloads: [],
      downloadInProgress: {
        filename: 'test',
        icon: false,
        ext: 'pdf',
        mime: 'test',
        date: '',
        savePath: ''
      }
    } as HistoryState
  }
})
