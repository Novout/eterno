export const usePath = () => {
  const { ipcRenderer } = window.require('electron')

  const openFolder = async (path: string) => {
    await ipcRenderer.invoke('open-folder', path)
  }

  return { openFolder }
}
