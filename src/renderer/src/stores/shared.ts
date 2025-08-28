import { defineStore } from 'pinia'
import { useHistoryStore } from './history'
import { useNavigatorStore } from './navigator'
import { useOptionsStore } from './options'
import { useProfileStore } from './profile'
import { useData } from '../use/data'
import { usePurge } from '@/use/purge'
import { Data } from '@/types'

export const useSharedStore = defineStore('shared', {
  actions: {
    start(values: Data) {
      const HISTORY = useHistoryStore()
      const NAVIGATOR = useNavigatorStore()
      const OPTIONS = useOptionsStore()
      const PROFILE = useProfileStore()

      const purge = usePurge()
      const data = purge.getData(values)

      HISTORY.$state = data.HISTORY
      NAVIGATOR.$state = data.NAVIGATOR
      OPTIONS.$state = data.OPTIONS
      PROFILE.$state = data.PROFILE
    },
    save() {
      const HISTORY = useHistoryStore()
      const NAVIGATOR = useNavigatorStore()
      const OPTIONS = useOptionsStore()
      const PROFILE = useProfileStore()

      const data = useData()

      // force webkit.loadUrl() in start browser
      const refreshNavigator = NAVIGATOR.$state
      refreshNavigator.views = refreshNavigator.views.map((view) => {
        let _view = view
        _view.loaded = false
        return _view
      })

      data.set('main', {
        HISTORY: HISTORY.$state,
        NAVIGATOR: refreshNavigator,
        OPTIONS: OPTIONS.$state,
        PROFILE: PROFILE.$state
      })
    }
  }
})
