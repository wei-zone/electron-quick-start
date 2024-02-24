<template>
    <div class="a-page home" v-loading="loading">
        <div class="a-page-inner home-inner">
            <a-card> this is home page </a-card>
        </div>
    </div>
</template>
<script setup lang="ts">
defineOptions({
    name: 'HomeView'
})

import { getList } from '@/apis/video'
import { useSocketStore } from '@/stores'
import { Message } from '@arco-design/web-vue'

const router = useRouter()
useSocketStore()

let loading = ref(true)

onMounted(() => {
    nextTick(async () => {
        try {
            const res = await getList()
            console.log(res)
            loading.value = false
        } catch (e) {
            console.log(e)
            Message.error('获取数据失败')
            loading.value = false
            // router.push({
            //     name: 'ControlView'
            // })
        }
    })
})
</script>
<style lang="scss">
@import './index.scss';
</style>
