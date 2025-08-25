import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  onDownloadItemStart: (cb: (data: Record<string, any>) => void) => {
    ipcRenderer.on('download-item-start', (_, data) => cb(data))
  },
  onDownloadItemDone: (
    cb: (data: { state: 'interrupted' | 'completed' | 'cancelled' }) => void
  ) => {
    ipcRenderer.on('download-item-done', (_, data) => cb(data))
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
