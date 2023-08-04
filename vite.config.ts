import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'

// 引入插件
import VitePluginMetaEnv from 'vite-plugin-meta-env'
import type { EnvVars } from 'vite-plugin-meta-env/types'
import dayjs from 'dayjs'

import pkg from './package.json'
const { title, version: APP_VERSION } = pkg

// 增加环境变量
const metaEnv: EnvVars = {
    APP_VERSION,
    APP_NAME: title,
    APP_BUILD_TIME: dayjs().format('YYYY-MM-DD HH:mm:ss')
}

// https://vitejs.dev/config/
export default () => {
    return defineConfig({
        plugins: [
            vue(),
            vueJsx(),
            electron([
                {
                    // Main-Process entry file of the Electron App.
                    entry: 'electron/main.ts'
                },
                {
                    entry: 'electron/preload.ts',
                    onstart(options) {
                        // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
                        // instead of restarting the entire Electron App.
                        options.reload()
                    }
                }
            ]),
            renderer(),
            // 环境变量
            VitePluginMetaEnv(metaEnv, 'import.meta.env')
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
        /*开发服务器选项*/
        server: {
            // 端口
            port: 3000
        }
    })
}
