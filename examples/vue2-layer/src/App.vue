<script setup lang="ts">
import { computed, watch } from "vue"
import { useRoute, useRouter } from "@gez/router-vue2"

// const $router = useRouter();

const $route = useRoute();

const route = computed(() => {
    const { matched, component, ...rest } = $route as any;
    return JSON.stringify(rest, null, 4);
});

// console.log('@router', $router);
// console.log('@route', $route);
</script>

<template>
    <div class="app">
        <!-- <header>
            <div class="wrapper">app.vue</div>
        </header> -->
        <div class="tabs">
            layerId: {{ $router.layerId }}
        </div>
        <div class="tabs">
            back forward
            <button @click="$router.back()">back</button>
            <button @click="$router.forward()">forward</button>
        </div>
        <div class="tabs">
            router.pushLayer
            <button @click="$router.pushLayer('/')">pushLayer /</button>
            <button @click="$router.pushLayer('/test1')">pushLayer /test1</button>
            <button @click="$router.pushLayer('/test1/test2')">pushLayer /test1/test2</button>
            <button @click="$router.pushLayer('/test3')">pushLayer /test3</button>
            <button @click="$router.pushLayer('/test4')">pushLayer /test4</button>
            <button @click="$router.pushLayer('/test4/4/5')">pushLayer /test4/4/5</button>
            <button @click="$router.pushLayer({
                path: '/test5/66/77',
                query: {
                    a: '1',
                    b: '2',
                },
                hash: '7788',
                state: {
                    test: '1234',
                },
            })">pushLayer /test5/66/77</button>
            <button @click="$router.pushLayer('/test6')">pushLayer /test6</button>
        </div>
        <div class="data">
            <pre>params: </pre>
            <pre>{{ $route.params }}</pre>
        </div>
        <div class="data">
            <pre>query: </pre>
            <pre>{{ $route.query }}</pre>
        </div>
        <router-view></router-view>
    </div>
</template>

<style>
.app {
    background-color: #fff;
}
.tabs {
    padding: 12px 0;

    >* {
        font-size: 16px;
        color: skyblue;
        padding: 6px;
    }
}

.data {
    padding: 6px 12px;
    color: slategrey;
    display: flex;
}
</style>
