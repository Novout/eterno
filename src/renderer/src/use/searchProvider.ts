import { useOptionsStore } from "../stores/options"
import { useRegex } from "./regex"

export const useSearchProvider = () => {
  const OPTIONS = useOptionsStore()

  const regex = useRegex()

  const getCorrectSearchURL = (url: string): string => {
    let target = url

    if (!regex.validateUrl(target)) {
      if (target.endsWith('.com')) {
        target = `https://${url}`
      } else {
        target = {
          'google': `https://www.google.com/search?q=${url}`,
          'bing': `https://www.bing.com/search?q=${url}`,
          'duckduckgo': `https://duckduckgo.com/?q=${url}`,
          'empty': 'https://'
        }[OPTIONS.searchProvider]
      }
    }

    return target
  }

  return { getCorrectSearchURL }
}
