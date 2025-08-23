import { useOptionsStore } from '@/stores/options'
import { useRegex } from './regex'

export const useSearchProvider = () => {
  const OPTIONS = useOptionsStore()

  const regex = useRegex()

  const cleanUrl = (url: string): string => {
    let cleanedUrl = url.includes('https') ? url.slice(8) : url.includes('http') && url.slice(7)

    if (!cleanedUrl) return ''

    return cleanedUrl.includes('/') ? cleanedUrl.split('/')[0] : cleanedUrl
  }

  const getFavicon = (url: string) => {
    return `http://www.google.com/s2/favicons?domain=${cleanUrl(url)}`
  }

  const getCorrectSearchURL = (url: string): string => {
    let target = url

    if (!regex.validateUrl(target)) {
      if (target.endsWith('.com')) {
        target = `https://${url}`
      } else {
        target = {
          google: `https://www.google.com/search?q=${url}`,
          bing: `https://www.bing.com/search?q=${url}`,
          duckduckgo: `https://duckduckgo.com/?q=${url}`,
          empty: 'https://'
        }[OPTIONS.searchProvider]
      }
    }

    return target
  }

  return { cleanUrl, getFavicon, getCorrectSearchURL }
}
