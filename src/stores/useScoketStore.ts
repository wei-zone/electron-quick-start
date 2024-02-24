import { defineStore } from 'pinia'
import { io } from 'socket.io-client'
import chalk from 'chalk'
import { Message } from '@arco-design/web-vue'

import { consoleEmit } from '@/types/scoket'

type CallBack = (socket: any) => void

export const useSocketStore: any = defineStore('useSocketStore', () => {
    const socket: any = io(import.meta.env.VITE_SOCKET_API_URL)

    const logger = (type: any, data?: any) => {
        // @ts-ignore
        console.group(type)
        console.log(chalk.blueBright('<- ') + chalk.gray(type))
        data && console.log(chalk.yellow(JSON.stringify(data)))
        console.groupEnd()
    }

    // 监听连接
    const onConnect = (cb?: CallBack) => {
        socket.on('connect', () => {
            Message.success('socket connected~')
            logger('socket connected:')
            cb && cb(socket)
        })
    }

    onConnect()

    // 监听断开连接
    const onDisconnect = (cb?: CallBack) => {
        socket.on('disconnect', () => {
            Message.warning('device disconnected！')
            logger('device disconnected:', socket.id)
            cb && cb(socket)
            socket.emit('hello', {
                msg: 'hello'
            })
        })
        socket.on('welcome', (data: any) => {
            console.log('welcome: ', data)
        })
    }
    onDisconnect()

    // 播放
    const controlPlay = (data: any) => {
        logger('controlPlay:', data)
        socket.emit(consoleEmit['controlPlay'], data)
    }


    return {
        socket,
        logger,
        onConnect,
        onDisconnect,
        controlPlay,
    }
})
