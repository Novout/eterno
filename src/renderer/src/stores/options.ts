import { OptionsState } from '@renderer/types'
import { defineStore } from 'pinia'

export const useOptionsStore = defineStore('options', {
  state: () => {
    return {
      searchProvider: 'google'
    } as OptionsState
  },
})
