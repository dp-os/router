import Vue, { nextTick } from 'vue'
import App from './App.vue'

import { createRouter, RouterMode } from '@gez/router';
import { RouterVuePlugin } from '@gez/router-vue2'

import Test from '@/components/Test.vue';
import TestT1 from '@/components/TestT1.vue';
import TestT2 from '@/components/TestT2.vue';
import TestT3 from '@/components/TestT3.vue';
import TestT4 from '@/components/TestT4.vue';
import TestT5 from '@/components/TestT5.vue';
import TestT6 from '@/components/TestT6.vue';

const router = createRouter({
    base: `${location.origin}/en`,
    // initUrl: '/test2',
    // mode: RouterMode.ABSTRACT,
    noBackNavigation: () => {
        console.log('@noBackNavigation');
    },
    nextTick: Vue.nextTick,
    routes: [
        {
            appType: 'vue2',
            path: 'test',
            component: Test,
            meta: {
                ll: '/test'
            }
        },
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
            path: 'test4/:id*',
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
            path: '(.*)*',
            asyncComponent: () => import('./components/All.vue')
        },
    ]
});

/* register用法 start */
Vue.use(RouterVuePlugin);

router.register('vue2', (router) => {
    // 服务端情况：不需要销毁实例
    // 客户端：路由跳转，调用新的应用类型时，这里需要销毁
    let app: Vue;
    const id = 'id-' + Math.random().toString().slice(2);
    return {
        mount() {
            app = new Vue({
                render: (h) => h(App),
                router,
            });
            const target = document.createElement('div');
            target.style.cssText = `
                position: fixed;
                inset: 0;
                z-index: 10;
                width: 100%;
                height: 100%;
                background-color: #fff;
                overflow: auto;
                outline: 0;
                -webkit-overflow-scrolling: touch;
            `;
            target.id = id;
            target.appendChild(document.createElement('div'));
            document.body.appendChild(target);
            nextTick(() => {
                app.$mount(target.children[0]);
            });
        },
        updated() {
            // console.log('@updated');
        },
        destroy() {
            const target = document.getElementById(id);
            console.log('@destroy', id, target);
            document.body.removeChild(target!);

            app.$el.remove();
            app.$destroy();
        }
    }
});

await router.init();

(window as any)['router'] = router;
(window as any)['route'] = router.route;
/* register用法 end */
