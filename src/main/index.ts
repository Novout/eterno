import { app, shell, BrowserWindow, ipcMain, DownloadItem } from 'electron'
import electronUpdater from 'electron-updater'
import { join } from 'pathe'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import Store from 'electron-store'
import icon from '../../resources/icon.png?asset'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1100,
    minWidth: 600,
    minHeight: 500,
    height: 800,
    show: false,
    fullscreen: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    maximizable: true,
    minimizable: true,
    icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: true,
      sandbox: false,
      webviewTag: true,
      contextIsolation: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler(() => {
    return { action: 'deny' }
  })

  // for navigate inside <webview> in _target links
  app.on('web-contents-created', (_, contents) => {
    if (contents.getType() === 'webview') {
      contents.setWindowOpenHandler(({ url }) => {
        mainWindow.webContents.send('open-new-view', url)

        return { action: 'deny' }
      })
    }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']).catch(() => {})
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html')).catch(() => {})
  }

  ipcMain.handle('window-minimize', (_) => {
    mainWindow.minimize()
  })

  ipcMain.handle('window-size', (_) => {
    mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()
  })

  ipcMain.handle('window-close', (_) => {
    mainWindow.close()
  })

  let downloads: DownloadItem[] = []

  const getDownload = (id: string) => downloads.find((download) => download.getURL() === id)

  ipcMain.handle('download-cancel', (_, id: string) => {
    downloads = downloads.filter((download) => download.getURL() !== id)

    getDownload(id)?.cancel()
  })

  ipcMain.handle('download-pause', (_, id: string) => {
    getDownload(id)?.pause()
  })

  ipcMain.handle('download-resume', (_, id: string) => {
    if (getDownload(id)?.canResume()) getDownload(id)?.resume()
  })

  mainWindow.webContents.session.on('will-download', (_, item) => {
    const id = item.getURL()

    downloads.push(item)

    // TODO: unique id for duplicate itens
    mainWindow.webContents.send('download-item-start', {
      id,
      filename: item.getFilename()
    })

    item.on('updated', (_, state) => {
      mainWindow.webContents.send('download-item-updated', {
        state,
        id,
        totalBytes: item.getTotalBytes(),
        receivedBytes: item.getReceivedBytes()
      })
    })

    item.once('done', (_, state) => {
      mainWindow.webContents.send('download-item-done', {
        state,
        id,
        path: item.getSavePath()
      })
    })
  })
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)

    if (!is.dev) {
      const { autoUpdater } = electronUpdater

      setTimeout(() => {
        autoUpdater.checkForUpdatesAndNotify()
      }, 3000)
    }
  })

  const store = new Store()

  ipcMain.handle('store-get', (_, key: string) => {
    // @ts-ignore
    return store.get(key)
  })

  ipcMain.handle('store-delete', (_, key: string) => {
    // @ts-ignore
    return store.delete(key)
  })

  ipcMain.handle('store-set', (_, key: string, value?: unknown) => {
    // @ts-ignore
    return store.set(key, value)
  })

  ipcMain.handle('open-folder', (_) => {
    // TODO: use localSavePath
    shell.openPath(join(app.getPath('downloads'), ''))
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
