import extMime from 'ext-name'

export const useUtils = () => {
  const getExtensionFromFilename = (target: string): [{ ext: string; mime: string }] => {
    const extensions = extMime(target)

    return extensions
  }

  return { getExtensionFromFilename }
}
