import { app, shell, BrowserWindow, ipcMain, clipboard } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { SHARED_EVENT } from '../shared/sharedEvent'

let mainWindow: BrowserWindow

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// my clipboard code starts --------
let clipboardHistory: string[] = []
let isBusy: boolean = false
console.log('is busy', isBusy)

console.log('before interval')
setInterval(() => {
  const clipboardText = clipboard.readText()
  console.log(isBusy ? 'busy' : 'not busy')

  const canAddToQueue =
    !isBusy && (clipboardHistory.length === 0 || clipboardHistory[0] !== clipboardText)
  if (canAddToQueue) {
    console.log('inside block')
    clipboardHistory.unshift(clipboardText)
    if (mainWindow) {
      console.log('clipboardHistory', clipboardHistory)
      mainWindow.webContents.send(SHARED_EVENT.CLIPBOARD_UPDATE, clipboardHistory)
      // mainWindow.webContents.
    }
  }
}, 500)

ipcMain.on(SHARED_EVENT.CLIPBOARD_SET, (_, text: string) => {
  isBusy = true
  console.log('xx')
  console.log('got event')
  clipboard.writeText(text)
  setTimeout(() => {
    isBusy = false
  }, 1000)
})

ipcMain.on(SHARED_EVENT.INITIAL_CLIPBOARD_REQ, () => {
  mainWindow.webContents.send(SHARED_EVENT.INITIAL_CLIPBOARD_RES, clipboardHistory)
})

ipcMain.on(SHARED_EVENT.CLEAR, () => {
  isBusy = true
  clipboardHistory = []
  setTimeout(() => {
    isBusy = false
  }, 1000)
})

console.log('main thread')
// -------- ends --------
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
