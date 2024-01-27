<template>
    <div class="a-page home">
        <a-form :model="form" :style="{ width: '600px' }" @submit="handleSubmit">
            <a-form-item field="name" tooltip="Please enter username" label="Username">
                <a-input v-model="form.name" placeholder="please enter your username..." />
            </a-form-item>
            <a-form-item field="post" label="Post">
                <a-input v-model="form.post" placeholder="please enter your post..." />
            </a-form-item>
            <a-form-item field="isRead">
                <a-checkbox v-model="form.isRead"> I have read the manual </a-checkbox>
            </a-form-item>
            <a-form-item>
                <a-button html-type="submit">Submit</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>
<script setup lang="ts">
defineOptions({
    name: 'HomeView',
    title: '首页'
})
import { useSocketStore } from '@/stores'
const { play } = useSocketStore()
const form = ref({
    name: '',
    post: '',
    isRead: false
})
const handleSubmit = (data) => {
    console.log(data.values)
    play(data.values)
}
onActivated(() => {
    console.log('HomeView onActivated')
})
</script>
<style lang="scss">
@import './index.scss';
</style>
