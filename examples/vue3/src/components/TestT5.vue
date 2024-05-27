<script setup lang="ts">
import { provide, inject } from "vue";
console.log('@inject test-5', inject('inject', 'default'));
provide('inject', 'test-5');
</script>

<template>
    <div>
        <h3 class="color">Test5</h3>
        <router-view></router-view>
    </div>
</template>

<style scoped>
h3 {
    font-weight: 500;
    top: -10px;
}

.color {
    color: brown;
}
</style>
