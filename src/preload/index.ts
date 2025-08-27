import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  onDownloadItemStart: (cb: (data: Record<string, any>) => void) => {
    ipcRenderer.on('download-item-start', (_, data) => cb(data))
  },
  onDownloadItemDone: (
    cb: (data: { state: 'interrupted' | 'completed' | 'cancelled' }) => void
  ) => {
    ipcRenderer.on('download-item-done', (_, data) => cb(data))
  },
  onDownloadItemUpdated: (
    cb: (data: {
      state: 'progressing' | 'interrupted'
      totalBytes: number
      receivedBytes: number
    }) => void
  ) => {
    ipcRenderer.on('download-item-updated', (_, data) => cb(data))
  },
  onOpenNewView: (cb: (url: string) => void) => {
    ipcRenderer.on('open-new-view', (_, url) => cb(url))
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore
  window.electron = electronAPI
  // @ts-ignore
  window.api = api
}
