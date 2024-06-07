<script setup lang="ts">
import { computed } from "vue"
import { useRoute, useRouter } from "@gez/router-vue2"

const route = computed(() => {
  const { matched, ...rest } = useRoute()
  return JSON.stringify(rest, null, 4)
})

const router = useRouter()
</script>

<template>
  <div id="app">
    <header>
      <div class="wrapper">app.vue</div>
    </header>
    <div class="tabs">
      router-link
      <router-link class="sss vvv" :class="['aaa',{
        test: false,
        kk: true
      }]" to="/" data="data" :query="JSON.stringify($route.query)">/</router-link>
      <router-link to="/test1" @click="console.log(123)">/test1</router-link>
      <router-link to="/test1/test2">/test1/test2</router-link>
      <router-link to="/test4/4/5">/test4/4/5</router-link>
      <router-link
        :to="{
          path: '/test4/66/77',
          query: {
            a: '1',
            b: '2',
          },
          hash: '7788',
          state: {
            test: '1234',
          },
        }"
        >/test4/66/77</router-link
      >
    </div>
    <div class="tabs">
      router-push
      <button @click="router.push('/')">push /</button>
      <button @click="router.push('/test1')">push /test1</button>
      <button @click="router.push('/test1/test2')">push /test1/test2</button>
      <button @click="router.push('/test2xxxxx')">push /test2xxxxx</button>
      <button @click="router.push('/test3-33')">push /test3-33</button>
      <button @click="router.push('/test4/44/55')">push /test4/44/55</button>
      <button
        @click="
          router.push({
            path: '/test4/66/77',
            query: {
              a: '1',
              b: '2',
            },
            hash: '7788',
            state: {
              test: '1234',
            },
          })
        "
      >
        push /test4/66/77
      </button>
      <button
        @click="
          router.push({
            keepScrollPosition: true,
            path: '/test4/99/11',
            query: {
              k: '2',
              b: '4',
            },
            hash: '5566',
            state: {
              test: '6789',
            },
          })
        "
      >
        push /test4/99/11 keepScrollPosition
      </button>
      <button
        @click="
          router.push({
            query: {
              k: '2',
              b: '4',
            },
          })
        "
      >
        push query: {
              k: '2',
              b: '4',
            }
      </button>
    </div>
    <div class="tabs">
      router-replace
      <button @click="router.replace('/')">replace /</button>
      <button @click="router.replace('/test1')">replace /test1</button>
      <button @click="router.replace('/test1/test2')">
        replace /test1/test2
      </button>
      <button @click="router.replace('/test2xxxxx')">push /test2xxxxx</button>
      <button @click="router.replace('/test3-33')">replace /test3-33</button>
      <button @click="router.replace('/test4/44/55')">
        replace /test4/44/55
      </button>
    </div>
    <div class="tabs">
      go
      <button @click="router.go(1)">go 1</button>
      <button @click="router.go(2)">go 2</button>
      <button @click="router.go(-1)">go -1</button>
      <button @click="router.go(-2)">go -2</button>
      <button @click="router.go(0)">go 0</button>
    </div>
    <div class="tabs">
      forward back
      <button @click="router.forward()">forward</button>
      <button @click="router.back()">back</button>
    </div>
    <div class="tabs">
      redirect
      <button @click="router.push('/redirect')">push /redirect</button>
      <button @click="router.push('/test5/1')">redirect /test5/1</button>
      <button @click="router.push('/test5/2')">redirect /test5/2</button>
      <button @click="router.push('/test5/3')">redirect /test5/3</button>
      <button @click="router.push('/test51/1')">redirect /test51/1</button>
      <button @click="router.push('/test51/2')">redirect /test51/2</button>
      <button @click="router.push('/test51/3')">redirect /test51/3</button>
      <button @click="router.push('/test52/1')">redirect /test52/1</button>
      <button @click="router.push('/test52/2')">redirect /test52/2</button>
      <button @click="router.push('/test52/3')">redirect /test52/3</button>
    </div>
    <div class="tabs">
      hooks
      <button @click="router.push('/beforeEnter')">push /beforeEnter</button>
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
  > * {
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
