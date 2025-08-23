import { defineStore } from 'pinia'
import { useHistoryStore } from './history'
import { useNavigatorStore } from './navigator'
import { useOptionsStore } from './options'
import { useProfileStore } from './profile'
import { useData } from '../use/data'
import { useI18n } from 'vue-i18n'

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

      // force webkit.loadUrl() in start browser
      const refreshNavigator = NAVIGATOR.$state
      refreshNavigator.views = refreshNavigator.views.map((view) => {
        let _view = view
        _view.loaded = false
        return _view
      })

      const { locale } = useI18n()
      // @ts-ignore
      OPTIONS.$state.preferences.language = locale.value

      data.set('initialize', {
        HISTORY: HISTORY.$state,
        NAVIGATOR: refreshNavigator,
        OPTIONS: OPTIONS.$state,
        PROFILE: PROFILE.$state
      })
    }
  }
})
