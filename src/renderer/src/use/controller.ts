import { useI18n } from 'vue-i18n'
import { useSharedStore } from '@/stores/shared'
import { useOptionsStore } from '@/stores/options'
import { useEnv } from './env'
import { usePubsub } from 'vue-pubsub'

export const useController = () => {
  const SHARED = useSharedStore()
  const OPTIONS = useOptionsStore()

  const { locale } = useI18n()
  const env = useEnv()
  const pubsub = usePubsub()

  const init = (values) => {
    if (!env.isDev()) {
      SHARED.start(values)

      locale.value = OPTIONS.$state.preferences.language

      pubsub.to('load-view-from-start-browser', '')
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
