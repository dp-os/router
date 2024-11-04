<!-- <script setup lang="ts">
import { computed, watch } from "vue"
import { useRoute, useRouter } from "@gez/router-vue2"

const router = useRouter();

const $route = useRoute();

const route = computed(() => {
  const { matched, ...rest } = $route;
  return JSON.stringify(rest, null, 4);
})

watch($route, (cur, old) => {
  console.log('@update', cur, cur.fullPath, cur === router.route);
});

</script> -->
<script lang="ts">
export default {
    name: "app",
    computed: {
        route() {
            const { matched, ...rest } = this.$route;
            return JSON.stringify(rest, null, 4);
        },
        router() {
            return this.$router;
        }
    },
    watch: {
        $route(cur, old) {
            console.log("@update", cur, cur.fullPath, cur === this.$router.route);
        }
    },
    beforeCreate() {
        console.log("@beforeCreate all");
    }
}
</script>

<template>
    <div id="app">
        <header>
            <div class="wrapper">app.vue</div>
        </header>
        <div class="tabs">
            router-link
            <router-link class="sss vvv" :class="{
                test: false,
                kk: true
            }" to="/" data="data" :query="JSON.stringify($route.query)">/</router-link>
            <router-link to="/test1" @click="console.log(123)">/test1</router-link>
            <router-link to="/test1/test2">/test1/test2</router-link>
            <router-link to="/test3">/test3</router-link>
            <router-link to="/test4">/test4</router-link>
            <router-link to="/test4/4/5">/test4/4/5</router-link>
            <router-link :to="{
                path: '/test4/66/77',
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
body {
    min-height: 2000px;
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
