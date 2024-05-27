<script lang="ts">
import { provide, inject } from "vue";
export default {
    name: "test-1",
    beforeCreate() {
        console.log('@inject test-1', inject('inject', 'default'));
        provide('inject', 'test-1')
        console.log("@beforeCreate test-1");
    }
}
</script>

<template>
    <div>
        <h3 class="color">Test1</h3>
        <router-view></router-view>
    </div>
</template>

<style scoped>
h3 {
    font-weight: 500;
    top: -10px;
}

.color {
    color: pink;
}
</style>
