import { HistoryState } from '@renderer/types'
import { defineStore } from 'pinia'

export const useHistoryStore = defineStore('history', {
  state: () => {
    return {
      list: []
    } as HistoryState
  }
})
