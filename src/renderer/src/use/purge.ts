import { Data } from '@/types'

export const usePurge = () => {
  const getData = (customData: Data): Data => {
    let _ = {
      HISTORY: customData?.HISTORY,
      NAVIGATOR: customData?.NAVIGATOR,
      OPTIONS: customData?.OPTIONS,
      PROFILE: customData?.PROFILE
    } as Data

    // intercept data for support older versions

    return _
  }

  return { getData }
}
