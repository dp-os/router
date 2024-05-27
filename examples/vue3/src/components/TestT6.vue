<script setup lang="ts">
import { provide, inject } from "vue";
console.log('@inject test-6', inject('inject', 'default'));
provide('inject', 'test-6');
</script>

<template>
    <div>
        <h3 class="color">Test6</h3>
        <router-view></router-view>
    </div>
</template>

<style scoped>
h3 {
    font-weight: 500;
    top: -10px;
}

.color {
    color: blueviolet;
}
</style>
