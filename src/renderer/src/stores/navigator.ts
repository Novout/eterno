import { NavigatorState } from '@/types'
import { defineStore } from 'pinia'

export const useNavigatorStore = defineStore('navigator', {
  state: () => {
    return {
      oldLink: {
        url: ''
      },
      actuallyLink: {
        url: ''
      },
      stateLink: {
        url: 'https://www.youtube.com/',
        loadedURL: 'default'
      },
      activeTab: 0,
      lastTab: 0,
      views: []
    } as NavigatorState
  }
})
