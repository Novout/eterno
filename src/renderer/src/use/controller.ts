import { useI18n } from 'vue-i18n'
import { useSharedStore } from '../stores/shared'
import { useOptionsStore } from '../stores/options'
import { usePubsub } from 'vue-pubsub'

export const useController = () => {
  const SHARED = useSharedStore()
  const OPTIONS = useOptionsStore()

  const { locale } = useI18n()
  const pubsub = usePubsub()

  const init = (values) => {
    if (!import.meta.env.DEV) {
      SHARED.start(values)

      locale.value = OPTIONS.$state.preferences.language
    }

    pubsub.to('add-first-page', '')
  }

  const close = () => {
    // @ts-ignore
    OPTIONS.$state.preferences.language = locale.value

    SHARED.save()
  }

  return { init, close }
}
