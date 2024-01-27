import { defineStore } from 'pinia'
import { io } from 'socket.io-client'
import { Message } from '@arco-design/web-vue'

export const useSocketStore: any = defineStore('useSocketStore', () => {
    // forceNew开启命名空间，query携带用户token
    const socket = io(`ws://localhost:3003`)
    socket.on('connect', () => {
        console.log('socket是否连接成功' + socket.connected) // true
    })

    socket.on('disconnect', () => {
        console.log('disconnect --->')
    })

    socket.on('playing', (e) => {
        console.log('playing', e)
        Message.success('playing')
    })

    const play = () => {
        socket.emit('play', {
            name: '张三'
        })
    }

    return {
        socket,
        play
    }
})
