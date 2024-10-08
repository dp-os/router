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
    // base: ({
    //     fullPath,
    //     // query,
    //     // queryArray,
    //     // hash
    // }) => {
    //     let base = `/en`;

    //     if (fullPath.includes('test3')) {
    //         base = `/en-3`;
    //     } else if (fullPath.includes('test4')) {
    //         base = `/en-4`;
    //     }

    //     return base;
    // },
    base: `${location.origin}/en`,
    // mode: RouterMode.ABSTRACT,
    noBackNavigation: () => {
        console.log('@noBackNavigation');
    },
    nextTick: Vue.nextTick,
    handleOutside: (location, replace) => {
        console.log('@handleOutside', location, replace);
        // window.open(location.href, '_blank');
        // return false;
        return true;
    },
    routes: [
        {
            // 这是一个错误的路由配置，但是会打印配置错误的提示
            appType: 'vue2',
            path: '*', // 应当为 (.*)*   (.*) 也能生效，但是建议使用(.*)*
            component: TestT1,
        },
        {
            appType: 'vue2',
            path: '',
            component: Test,
            beforeEnter: async (from, to) => {
                await new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(true);
                    }, 50);
                });
                console.log('beforeEnter', '0', from.fullPath, to.fullPath);
            },
            beforeUpdate: async (from, to) => {
                await new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(true);
                    }, 50);
                });
                console.log('beforeUpdate', '0', from.fullPath, to.fullPath);
            },
            beforeLeave: async (from, to) => {
                await new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(true);
                    }, 50);
                });
                console.log('beforeLeave', '0', from.fullPath, to.fullPath);
            },
            children: [
                {
                    path: "",
                    component: TestT1,
                    meta: {
                        title: 'TestT1'
                    },
                    beforeEnter: async (from, to) => {
                        await new Promise((resolve) => {
                            setTimeout(() => {
                                resolve(true);
                            }, 50);
                        });
                        console.log('beforeEnter', '1', from.fullPath, to.fullPath);
                    },
                    beforeUpdate: async (from, to) => {
                        await new Promise((resolve) => {
                            setTimeout(() => {
                                resolve(true);
                            }, 50);
                        });
                        console.log('beforeUpdate', '1', from.fullPath, to.fullPath);
                    },
                    beforeLeave: async (from, to) => {
                        await new Promise((resolve) => {
                            setTimeout(() => {
                                resolve(true);
                            }, 50);
                        });
                        console.log('beforeLeave', '1', from.fullPath, to.fullPath);
                    },
                    children: [
                        {
                            path: "",
                            component: TestT2,
                            beforeEnter: async (from, to) => {
                                await new Promise((resolve) => {
                                    setTimeout(() => {
                                        resolve(true);
                                    }, 50);
                                });
                                console.log('beforeEnter', '2', from.fullPath, to.fullPath);
                            },
                            beforeUpdate: async (from, to) => {
                                await new Promise((resolve) => {
                                    setTimeout(() => {
                                        resolve(true);
                                    }, 50);
                                });
                                console.log('beforeUpdate', '2', from.fullPath, to.fullPath);
                            },
                            beforeLeave: async (from, to) => {
                                await new Promise((resolve) => {
                                    setTimeout(() => {
                                        resolve(true);
                                    }, 50);
                                });
                                console.log('beforeLeave', '2', from.fullPath, to.fullPath);
                            },
                            children: [
                                {
                                    path: "",
                                    component: TestT3,
                                    beforeEnter: async (from, to) => {
                                        await new Promise((resolve) => {
                                            setTimeout(() => {
                                                resolve(true);
                                            }, 50);
                                        });
                                        console.log('beforeEnter', '3', from.fullPath, to.fullPath);
                                    },
                                    beforeUpdate: async (from, to) => {
                                        await new Promise((resolve) => {
                                            setTimeout(() => {
                                                resolve(true);
                                            }, 50);
                                        });
                                        console.log('beforeUpdate', '3', from.fullPath, to.fullPath);
                                    },
                                    beforeLeave: async (from, to) => {
                                        await new Promise((resolve) => {
                                            setTimeout(() => {
                                                resolve(true);
                                            }, 50);
                                        });
                                        console.log('beforeLeave', '3', from.fullPath, to.fullPath);
                                    },
                                    children: [
                                        {
                                            path: '',
                                            component: TestT4,
                                            beforeEnter: async (from, to) => {
                                                await new Promise((resolve) => {
                                                    setTimeout(() => {
                                                        resolve(true);
                                                    }, 50);
                                                });
                                                console.log('beforeEnter', '4', from.fullPath, to.fullPath);
                                            },
                                            beforeUpdate: async (from, to) => {
                                                await new Promise((resolve) => {
                                                    setTimeout(() => {
                                                        resolve(true);
                                                    }, 50);
                                                });
                                                console.log('beforeUpdate', '4', from.fullPath, to.fullPath);
                                            },
                                            beforeLeave: async (from, to) => {
                                                await new Promise((resolve) => {
                                                    setTimeout(() => {
                                                        resolve(true);
                                                    }, 50);
                                                });
                                                console.log('beforeLeave', '4', from.fullPath, to.fullPath);
                                            },
                                            children: [
                                                {
                                                    path: "",
                                                    component: TestT5,
                                                    beforeEnter: async (from, to) => {
                                                        await new Promise((resolve) => {
                                                            setTimeout(() => {
                                                                resolve(true);
                                                            }, 50);
                                                        });
                                                        console.log('beforeEnter', '5', from.fullPath, to.fullPath);
                                                    },
                                                    beforeUpdate: async (from, to) => {
                                                        await new Promise((resolve) => {
                                                            setTimeout(() => {
                                                                resolve(true);
                                                            }, 50);
                                                        });
                                                        console.log('beforeUpdate', '5', from.fullPath, to.fullPath);
                                                    },
                                                    beforeLeave: async (from, to) => {
                                                        await new Promise((resolve) => {
                                                            setTimeout(() => {
                                                                resolve(true);
                                                            }, 50);
                                                        });
                                                        console.log('beforeLeave', '5', from.fullPath, to.fullPath);
                                                    },
                                                    children: [
                                                        {
                                                            path: "",
                                                            component: TestT6,
                                                            beforeEnter: async (from, to) => {
                                                                await new Promise((resolve) => {
                                                                    setTimeout(() => {
                                                                        resolve(true);
                                                                    }, 50);
                                                                });
                                                                console.log('beforeEnter', '6', from.fullPath, to.fullPath);
                                                            },
                                                            beforeUpdate: async (from, to) => {
                                                                await new Promise((resolve) => {
                                                                    setTimeout(() => {
                                                                        resolve(true);
                                                                    }, 50);
                                                                });
                                                                console.log('beforeUpdate', '6', from.fullPath, to.fullPath);
                                                            },
                                                            beforeLeave: async (from, to) => {
                                                                await new Promise((resolve) => {
                                                                    setTimeout(() => {
                                                                        resolve(true);
                                                                    }, 50);
                                                                });
                                                                console.log('beforeLeave', '6', from.fullPath, to.fullPath);
                                                            },
                                                        },
                                                    ]
                                                },
                                            ]
                                        },
                                    ]
                                },
                            ]
                        },
                    ]
                },
            ]
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
            path: 'test2(.*)',
            component: TestT2
        },
        {
            appType: 'vue2',
            path: 'test3-:id',
            component: TestT3
        },
        {
            appType: 'vue2',
            path: 'test4/:id/:name',
            // component: TestT4,
            asyncComponent: async () => {
                await new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(true);
                    }, 1000);
                });
                return import('./components/TestT4.vue')
            },
            beforeEnter: async (from, to) => {
                await new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(true);
                    }, 50);
                });
                console.log('beforeEnter', 'test4', from.fullPath, to.fullPath);
            },
            beforeUpdate: async (from, to) => {
                await new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(true);
                    }, 50);
                });
                console.log('beforeUpdate', 'test4', from.fullPath, to.fullPath);
            },
            beforeLeave: async (from, to) => {
                await new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(true);
                    }, 50);
                });
                console.log('beforeLeave', 'test4', from.fullPath, to.fullPath);
            },
        },
        {
            appType: 'vue2',
            path: ['test5', 'test51', 'test52'],
            component: TestT5,
            children: [
                {
                    path: ['1', '2', '3'],
                    component: TestT6
                },
            ]
        },
        {
            appType: 'vue2',
            path: ['tt1', 'tt2', 'tt3'],
            component: TestT1,
            children: [
                {
                    path: ['1', '2', '3'],
                    component: TestT6,
                    children: [
                        {
                            path: ':id?',
                            component: TestT2
                        }
                    ]
                },
                {
                    path: ':id?',
                    component: TestT3
                }
            ]
        },
        {
            appType: 'vue2',
            path: 'redirect',
            redirect: 'test2'
        },
        {
            appType: 'vue2',
            path: 'beforeEnter',
            beforeEnter: async (from, to) => {
                await new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(true);
                    }, 50);
                });
                console.log('beforeEnter', 'hook', from.fullPath, to.fullPath);
                return '/test1'
            },
            beforeUpdate: async (from, to) => {
                await new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(true);
                    }, 50);
                });
                console.log('beforeUpdate', 'hook', from.fullPath, to.fullPath);
            },
            beforeLeave: async (from, to) => {
                await new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(true);
                    }, 50);
                });
                console.log('beforeLeave', 'hook', from.fullPath, to.fullPath);
            },
        },
        {
            appType: 'vue2',
            path: '(.*)*',
            asyncComponent: () => import('./components/All.vue')
        },
    ]
});

router.beforeEach(async (from, to) => {
    await new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, 50);
    });
    console.log('beforeEach 1', from.fullPath, to.fullPath);
});
router.beforeEach(async (from, to) => {
    await new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, 50);
    });
    console.log('beforeEach 2', from.fullPath, to.fullPath);
});
router.afterEach(async (from, to) => {
    await new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, 50);
    });
    console.log('afterEach 1', from.fullPath, to.fullPath);
});
router.afterEach(async (from, to) => {
    await new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, 50);
    });
    console.log('afterEach 2', from.fullPath, to.fullPath);
});

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
            console.log('@mount');
            app.$mount('#app');
        },
        updated() {
            console.log('@updated');
        },
        destroy() {
            console.log('@destroy');
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
