export const useDownload = () => {
  const { ipcRenderer } = window.require('electron')

  const cancel = async (id: string) => {
    await ipcRenderer.invoke('download-cancel', id)
  }

  const pause = async (id: string) => {
    await ipcRenderer.invoke('download-pause', id)
  }

  const resume = async (id: string) => {
    await ipcRenderer.invoke('download-resume', id)
  }

  return { cancel, pause, resume }
}
