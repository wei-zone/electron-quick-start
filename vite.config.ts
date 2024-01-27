import { fileURLToPath, URL } from 'node:url'
import { ConfigEnv, defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'

import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'

// 引入插件
import VitePluginMetaEnv from 'vite-plugin-meta-env'
import type { EnvVars } from 'vite-plugin-meta-env/types'
import dayjs from 'dayjs'

import pkg from './package.json'
const { title, version: APP_VERSION } = pkg

// https://vitejs.dev/config/
export default (configEnv: ConfigEnv) => {
    const { mode } = configEnv
    console.log('mode --->', mode)
    console.log('\t')

    // 增加环境变量
    const metaEnv: EnvVars = {
        APP_VERSION,
        APP_NAME: title,
        APP_BUILD_TIME: dayjs().format('YYYY-MM-DD HH:mm:ss')
    }

    return defineConfig({
        plugins: [
            vue({
                script: {
                    defineModel: true
                }
            }),
            vueJsx(),
            // 按需导入
            AutoImport({
                // targets to transform
                include: [
                    /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
                    /\.vue$/,
                    /\.vue\?vue/, // .vue
                    /\.md$/ // .md
                ],

                // global imports to register
                imports: ['vue', 'vue-router', 'pinia'],

                // Filepath to generate corresponding .d.ts file.
                // Defaults to './auto-imports.d.ts' when `typescript` is installed locally.
                // Set `false` to disable.
                dts: './auto-imports.d.ts',

                // Inject the imports at the end of other imports
                injectAtEnd: true,

                // Generate corresponding .eslintrc-auto-import.json file.
                // eslint globals Docs - https://eslint.org/docs/user-guide/configuring/language-options#specifying-globals
                eslintrc: {
                    enabled: true, // Default `false`
                    filepath: './.eslintrc-auto-import.json' // Default `./.eslintrc-auto-import.json`
                },
                resolvers: [ArcoResolver()]
            }),
            Components({
                resolvers: [
                    ArcoResolver({
                        sideEffect: true
                    })
                ]
            }),
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
        // 本地服务配置
        server: {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            cors: true,
            open: false,
            port: 3000,
            host: true,
            proxy: {
                '/apis/': {
                    target: 'https://forguo.cn/api/',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/apis/, '')
                },
                '/amap/': {
                    target: 'https://restapi.amap.com/',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/amap/, '')
                }
            }
        }
    })
}
