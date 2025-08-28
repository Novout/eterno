import { Data } from '@/types'
import { useHistoryStore } from '@/stores/history'
import { useNavigatorStore } from '@/stores/navigator'
import { useOptionsStore } from '@/stores/options'
import { useProfileStore } from '@/stores/profile'

export const usePurge = () => {
  const HISTORY = useHistoryStore()
  const NAVIGATOR = useNavigatorStore()
  const OPTIONS = useOptionsStore()
  const PROFILE = useProfileStore()

  const getData = (customData?: Data): Data => {
    let _ = {
      HISTORY: customData?.HISTORY || HISTORY.$state,
      NAVIGATOR: customData?.NAVIGATOR || NAVIGATOR.$state,
      OPTIONS: customData?.OPTIONS || OPTIONS.$state,
      PROFILE: customData?.PROFILE || PROFILE.$state
    } as Data

    // intercept data for support older versions

    return _
  }

  return { getData }
}
