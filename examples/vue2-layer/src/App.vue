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
        <header>
            <div class="wrapper">app.vue</div>
        </header>
        <div class="tabs">
            go
            <button @click="$router.go(-5)">go -5</button>
            <button @click="$router.go(-3)">go -3</button>
            <button @click="$router.go(-2)">go -2</button>
            <button @click="$router.go(-1)">go -1</button>
            <button @click="$router.go(0)">go 0</button>
            <button @click="$router.go(1)">go 1</button>
            <button @click="$router.go(2)">go 2</button>
            <button @click="$router.go(5)">go 5</button>
        </div>
        <div class="tabs">
            back forward
            <button @click="$router.back()">back</button>
            <button @click="$router.forward()">forward</button>
        </div>
        <div class="tabs">
            router-link
            <router-link to="/">/</router-link>
            <router-link to="/test1">/test1</router-link>
            <router-link to="/test1/test2">/test1/test2</router-link>
            <router-link to="/test3">/test3</router-link>
            <router-link to="/test4">/test4</router-link>
            <router-link to="/test4/4/5">/test4/4/5</router-link>
            <router-link :to="{
                path: '/test5/66/77',
                query: {
                    a: '1',
                    b: '2',
                },
                hash: '7788',
                state: {
                    test: '1234',
                },
            }">/test5/66/77</router-link>
            <router-link to="/test6">/test6</router-link>
        </div>
        <div class="tabs">
            router.push
            <button @click="$router.push('/')">push /</button>
            <button @click="$router.push('/test1')">push /test1</button>
            <button @click="$router.push('/test1/test2')">push /test1/test2</button>
            <button @click="$router.push('/test3')">push /test3</button>
            <button @click="$router.push('/test4')">push /test4</button>
            <button @click="$router.push('/test4/4/5')">push /test4/4/5</button>
            <button @click="$router.push({
                path: '/test5/66/77',
                query: {
                    a: '1',
                    b: '2',
                },
                hash: '7788',
                state: {
                    test: '1234',
                },
            })">push /test5/66/77</button>
            <button @click="$router.push('/test6')">push /test6</button>
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
            <pre>route: </pre>
            <pre>{{ route }}</pre>
        </div>
        <div class="data">
            <pre>params: </pre>
            <pre>{{ $route.params }}</pre>
        </div>
        <div class="data">
            <pre>query: </pre>
            <pre>{{ $route.query }}</pre>
        </div>
        <div class="data">
            <pre>queryArray: </pre>
            <pre>{{ $route.queryArray }}</pre>
        </div>
        <div class="data">
            <pre>state: </pre>
            <pre>{{ $route.state }}</pre>
        </div>
        <div class="data">
            <pre>hash: </pre>
            <pre>{{ $route.hash }}</pre>
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
