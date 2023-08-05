// electron-main/index.ts
// electron 模块可以用来控制应用的生命周期和创建原生浏览窗口
import { app, BrowserWindow } from 'electron'
import path from 'node:path'

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js

process.env.DIST = path.join(__dirname, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

let win: any | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
const createWindow = () => {
    // 创建浏览窗口
    win = new BrowserWindow({
        icon: path.join('../public/favicon.ico'),
        webPreferences: {
            preload: path.join('preload.js')
        },
        // 默认不展示
        show: false,
        // 背景色
        backgroundColor: '#fff'
    })

    // 优雅地显示窗口
    win.once('ready-to-show', () => {
        win.show()
        // 进来就是全屏
        win.setFullScreen(true)
    })

    // Test active push message to Renderer-process.
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', new Date().toLocaleString())
    })

    // development模式
    if (VITE_DEV_SERVER_URL) {
        win.loadURL(VITE_DEV_SERVER_URL)
    } else {
        // win.loadFile('dist/index.html')
        // 加载 index.html
        win.loadFile(path.join(process.env.DIST, 'index.html'))
    }
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
    createWindow() // 创建窗口
    app.on('activate', () => {
        // 在 macOS 系统内, 如果没有已开启的应用窗口
        // 点击托盘图标时通常会重新创建一个新窗口
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此, 通常
// 对应用程序和它们的菜单栏来说应该时刻保持激活状态,
// 直到用户使用 Cmd + Q 明确退出
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
    win = null
})
