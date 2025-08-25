import extMime from 'ext-name'

export const useUtils = () => {
  const getExtensionFromFilename = (target: string): [{ ext: string; mime: string }] => {
    const extensions = extMime(target)

    if (extensions.lenght !== 1) return [{ ext: '', mime: '' }]

    return extensions
  }

  return { getExtensionFromFilename }
}
