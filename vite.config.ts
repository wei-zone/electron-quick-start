import { fileURLToPath, URL } from 'node:url'
import { ConfigEnv, defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'

import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
// @ts-ignore
import { viteObfuscateFile } from 'vite-plugin-obfuscator'

// 引入插件
import VitePluginMetaEnv from 'vite-plugin-meta-env'
import type { EnvVars } from 'vite-plugin-meta-env/types'
import dayjs from 'dayjs'

const { name: title, version: APP_VERSION } = require('./package.json')

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
            VitePluginMetaEnv(metaEnv, 'import.meta.env'),
            // 代码混淆
            viteObfuscateFile({
                compact: true,
                controlFlowFlattening: false,
                controlFlowFlatteningThreshold: 0.75,
                deadCodeInjection: false,
                deadCodeInjectionThreshold: 0.4,
                debugProtection: false,
                debugProtectionInterval: 0,
                disableConsoleOutput: false,
                domainLock: [],
                domainLockRedirectUrl: 'about:blank',
                forceTransformStrings: [],
                identifierNamesCache: null,
                identifierNamesGenerator: 'hexadecimal',
                identifiersDictionary: [],
                identifiersPrefix: '',
                ignoreImports: false,
                inputFileName: '',
                log: false,
                numbersToExpressions: false,
                optionsPreset: 'default',
                renameGlobals: false,
                renameProperties: false,
                renamePropertiesMode: 'safe',
                reservedNames: [],
                reservedStrings: [],
                seed: 0,
                selfDefending: false,
                simplify: true,
                sourceMap: false,
                sourceMapBaseUrl: '',
                sourceMapFileName: '',
                sourceMapMode: 'separate',
                sourceMapSourcesMode: 'sources-content',
                splitStrings: false,
                splitStringsChunkLength: 10,
                stringArray: true,
                stringArrayCallsTransform: true,
                stringArrayCallsTransformThreshold: 0.5,
                stringArrayEncoding: [],
                stringArrayIndexesType: ['hexadecimal-number'],
                stringArrayIndexShift: true,
                stringArrayRotate: true,
                stringArrayShuffle: true,
                stringArrayWrappersCount: 1,
                stringArrayWrappersChainedCalls: true,
                stringArrayWrappersParametersMaxCount: 2,
                stringArrayWrappersType: 'variable',
                stringArrayThreshold: 0.75,
                target: 'browser',
                transformObjectKeys: false,
                unicodeEscapeSequence: false
            })
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
            port: 3101,
            host: true,
            proxy: {
                '/apis/': {
                    target: 'http://127.0.0.1:3003/',
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
