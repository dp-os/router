<script lang="ts">
import { provide, inject } from "vue";
export default {
    name: "test",
    beforeCreate() {
        console.log('@inject test', inject('inject', 'default'));
        provide('inject', 'test')
        console.log("@beforeCreate test");
    }
}
</script>

<template>
    <div>
        <h3 class="color">Test</h3>
        <router-view></router-view>
    </div>
</template>

<style scoped>
h3 {
    font-weight: 500;
    top: -10px;
}

.color {
    color: saddlebrown;
}
</style>
