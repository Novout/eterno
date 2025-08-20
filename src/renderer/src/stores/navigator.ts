import { NavigatorState } from '@renderer/types'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid';

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
      views: [{
        icon: '',
        title: 'Eterno',
        url: '',
        search: 'Eterno',
        loaded: false,
        id: uuidv4()
      }]
    } as NavigatorState
  },
})
