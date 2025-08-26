export const useDownload = () => {
  const { ipcRenderer } = window.require('electron')

  const cancel = async () => {
    await ipcRenderer.invoke('download-cancel')
  }

  const pause = async () => {
    await ipcRenderer.invoke('download-pause')
  }

  const resume = async () => {
    await ipcRenderer.invoke('download-resume')
  }

  return { cancel, pause, resume }
}
