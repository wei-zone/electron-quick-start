import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getSearchParam } from '@/libs'

export const useUserStore = defineStore('useUserStore', () => {
    const token = ref<string>('')

    const clearToken = () => {
        token.value = ''
        localStorage.clear()
    }

    const userLogout = () => {
        console.log('userLogout ---> clearToken')
        clearToken()
    }

    const initToken = () => {
        // 获取url中的token
        token.value = getSearchParam('token') || ''
    }

    initToken()

    return {
        token,
        clearToken,
        userLogout
    }
})
