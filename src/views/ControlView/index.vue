<template>
    <div class="a-page control">
        <div class="a-page-inner control-inner">
            <a-button type="primary" status="success" @click="handleControl('Play')">Play</a-button>
        </div>
    </div>
</template>
<script setup lang="ts">
defineOptions({
    name: 'ControlView'
})

import { useSocketStore } from '@/stores'
const socketStore = useSocketStore()
const route = useRoute()

const handleControl = (type: string) => {
    socketStore[`control${type}`]({
        src: Date.now(),
        type
    })
}

onActivated(() => {
    const src = route.query.src as string
    console.log('<- src', src)
})
</script>
<style lang="scss">
@import './index.scss';
</style>
