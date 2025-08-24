import { OptionsState } from '@/types'
import { defineStore } from 'pinia'

export const useOptionsStore = defineStore('options', {
  state: () => {
    return {
      preferences: {
        searchProvider: 'google',
        language: 'English'
      }
    } as OptionsState
  }
})
