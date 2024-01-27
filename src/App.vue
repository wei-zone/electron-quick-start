<script setup lang="ts">
import { RouterView } from 'vue-router'
import { KeepAlive } from 'vue'
import { useSocketStore } from '@/stores'
useSocketStore()
</script>

<template>
    <router-view v-slot="{ Component }">
        <keep-alive>
            <component :is="Component" />
        </keep-alive>
    </router-view>
</template>
