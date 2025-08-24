import { useI18n } from 'vue-i18n'
import { useSharedStore } from '@/stores/shared'
import { useOptionsStore } from '@/stores/options'
import { useEnv } from './env'

export const useController = () => {
  const SHARED = useSharedStore()
  const OPTIONS = useOptionsStore()

  const { locale } = useI18n()
  const env = useEnv()

  const init = (values) => {
    if (!env.isDev()) {
      SHARED.start(values)

      locale.value = OPTIONS.$state.preferences.language
    }
  }

  const close = () => {
    if (!env.isDev()) {
      // @ts-ignore
      OPTIONS.$state.preferences.language = locale.value

      SHARED.save()
    }
  }

  return { init, close }
}
