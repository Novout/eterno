import { defineStore } from 'pinia'
import { useHistoryStore } from './history'
import { useNavigatorStore } from './navigator'
import { useOptionsStore } from './options'
import { useProfileStore } from './profile'
import { useData } from '../use/data'

export const useSharedStore = defineStore('shared', {
  actions: {
    start(values: Record<string, any>) {
      const HISTORY = useHistoryStore()
      const NAVIGATOR = useNavigatorStore()
      const OPTIONS = useOptionsStore()
      const PROFILE = useProfileStore()

      HISTORY.$state = values.HISTORY
      NAVIGATOR.$state = values.NAVIGATOR
      OPTIONS.$state = values.OPTIONS
      PROFILE.$state = values.PROFILE
    },
    save() {
      const HISTORY = useHistoryStore()
      const NAVIGATOR = useNavigatorStore()
      const OPTIONS = useOptionsStore()
      const PROFILE = useProfileStore()

      const data = useData()

      data.set('initialize', {
        HISTORY: HISTORY.$state,
        NAVIGATOR: NAVIGATOR.$state,
        OPTIONS: OPTIONS.$state,
        PROFILE: PROFILE.$state
      })
    }
  }
})
