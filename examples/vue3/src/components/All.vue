<script lang="ts">
import { provide, inject } from "vue";
export default {
    name: "all",
    beforeCreate() {
        console.log("@beforeCreate all");
        console.log('@inject all', inject('inject', 'default'));
        provide('inject', 'all')
    }
}
</script>

<template>
    <div>
        <h3 class="color">通配符路由</h3>
        <!-- <router-view></router-view> -->
    </div>
</template>

<style scoped>
h3 {
    font-weight: 500;
    top: -10px;
}

.color {
    color: red;
}
</style>
