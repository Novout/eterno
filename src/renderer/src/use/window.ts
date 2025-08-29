export const useWindow = () => {
  const { ipcRenderer } = window.require('electron')

  const minimize = async () => {
    await ipcRenderer.invoke('window-minimize')
  }

  const size = async () => {
    await ipcRenderer.invoke('window-size')
  }

  const close = async () => {
    await ipcRenderer.invoke('window-close')
  }

  return { minimize, size, close }
}
