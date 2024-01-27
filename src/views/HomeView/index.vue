<template>
    <div class="a-page home">
        <a-button @click="play">{{ button }}</a-button>
        <main>
            <video
                src="../../assets/mov_bbb.mp4"
                controls
                crossorigin="anonymous"
                style="width: 100%; height: 100%"
            />
        </main>
    </div>
</template>
<script setup lang="ts">
defineOptions({
    name: 'HomeView',
    title: '首页'
})
import { useSocketStore } from '@/stores'
const { play } = useSocketStore()
let button = ref('播放')

onActivated(() => {
    console.log('HomeView onActivated')
})
</script>
<style lang="scss">
@import './index.scss';
</style>
