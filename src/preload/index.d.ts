import { HistoryDownloadsMain } from '@/types'
import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      onDownloadItemStart(cb: (data: HistoryDownloadsMain & { id: string }) => void): void
      onDownloadItemDone(
        cb: (data: {
          state: 'interrupted' | 'completed' | 'cancelled'
          path: 'string'
          id: string
        }) => void
      ): void
      onDownloadItemUpdated(
        cb: (data: {
          state: 'progressing' | 'interrupted'
          id: string
          totalBytes: number
          receivedBytes: number
        }) => void
      ): void
    }
  }
}
