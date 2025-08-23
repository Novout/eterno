import { ProfileState } from '@/types'
import { defineStore } from 'pinia'

export const useProfileStore = defineStore('profile', {
  state: () => {
    return {
      name: '',
      image: undefined,
      xp: {
        level: 1,
        level_amount: 0
      },
      conquests: {}
    } as ProfileState
  }
})
