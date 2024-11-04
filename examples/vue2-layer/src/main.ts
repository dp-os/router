import Vue from 'vue'
import App from './App.vue'

import { createRouter, RouterMode } from '@gez/router';
import { RouterVuePlugin } from '@gez/router-vue2'

import Test from './components/Test.vue';
import TestT1 from './components/TestT1.vue';
import TestT2 from './components/TestT2.vue';
import TestT3 from './components/TestT3.vue';
import TestT4 from './components/TestT4.vue';
import TestT5 from './components/TestT5.vue';
import TestT6 from './components/TestT6.vue';

const router = createRouter({
    base: `${location.origin}/en`,
    // mode: RouterMode.ABSTRACT,
    noBackNavigation: () => {
        console.log('@noBackNavigation');
    },
    nextTick: Vue.nextTick,
    routes: [
        {
            appType: 'vue2',
            path: 'test1',
            component: TestT1,
            meta: {
                nn: '/test1'
            },
            children: [
                {
                    path: "test2",
                    component: TestT2,
                    meta: {
                        title: 'test1/test2'
                    },
                }
            ]
        },
        {
            appType: 'vue2',
            path: 'test2',
            component: TestT2,
            meta: {
                type: '/test2'
            }
        },
        {
            appType: 'vue2',
            path: 'test3/:id?/:name?',
            component: TestT3,
            meta: {
                type: '/test3'
            }
        },
        {
            appType: 'vue2',
            path: 'test4/:id?/:name?',
            component: TestT4,
            meta: {
                type: '/test4'
            }
        },
        {
            appType: 'vue2',
            path: 'test5/:id?/:name?',
            component: TestT5,
            meta: {
                type: '/test5'
            }
        },
        {
            appType: 'vue2',
            path: 'test6/:id?/:name?',
            component: TestT6,
            meta: {
                type: '/test6'
            }
        },
        {
            appType: 'vue2',
            path: 'test5',
            component: TestT5,
            meta: {
                type: '/test5'
            }
        },
        {
            appType: 'vue2',
            path: '(.*)*',
            asyncComponent: () => import('./components/All.vue')
        },
    ]
});

// router.beforeEach(async (from, to) => {
//     await new Promise((resolve) => {
//         setTimeout(() => {
//             resolve(true);
//         }, 50);
//     });
//     console.log('beforeEach 1', from.fullPath, to.fullPath);
// });
// router.beforeEach(async (from, to) => {
//     await new Promise((resolve) => {
//         setTimeout(() => {
//             resolve(true);
//         }, 50);
//     });
//     console.log('beforeEach 2', from.fullPath, to.fullPath);
// });
// router.afterEach(async (from, to) => {
//     await new Promise((resolve) => {
//         setTimeout(() => {
//             resolve(true);
//         }, 50);
//     });
//     console.log('afterEach 1', from.fullPath, to.fullPath);
// });
// router.afterEach(async (from, to) => {
//     await new Promise((resolve) => {
//         setTimeout(() => {
//             resolve(true);
//         }, 50);
//     });
//     console.log('afterEach 2', from.fullPath, to.fullPath);
// });

/* register用法 start */
Vue.use(RouterVuePlugin);

router.register('vue2', (router) => {
    // 服务端情况：不需要销毁实例
    // 客户端：路由跳转，调用新的应用类型时，这里需要销毁
    const app = new Vue({
        render: (h) => h(App),
        router,
    });
    return {
        mount() {
            // console.log('@mount');
            app.$mount('#app');
        },
        updated() {
            // console.log('@updated');
        },
        destroy() {
            // console.log('@destroy');
            app.$destroy();
        }
    }
});

await router.init();

(window as any)['router'] = router;
(window as any)['route'] = router.route;
/* register用法 end */


/* 单应用便捷用法 start */
// Vue.use(RouterVuePlugin);
// router.init();
// const app = new Vue({
//     render: (h) => h(App),
//     router,
// }).$mount('#app');

// // for debugger
// (window as any)['app'] = app;
// (window as any)['router'] = router;
// (window as any)['route'] = router.route;
/* 单应用便捷用法 start */
