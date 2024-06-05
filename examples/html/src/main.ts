import { createRouter, type RouterInstance } from '@gez/router';
// import Handlebars from 'handlebars';

import Test from './template/test';
import Test1 from './template/test1';
import Test2 from './template/test2';
import Test3 from './template/test3';
import Test4 from './template/test4';
import All from './template/all';

const router = createRouter({
    routes: [
        {
            appType: 'html',
            path: '',
            component: Test,
            children: [
                {
                    path: "",
                    component: Test1,
                    meta: {
                        title: 'Test1'
                    },
                    children: [
                        {
                            path: "",
                            component: Test2,
                            children: [
                                {
                                    path: "",
                                    component: Test3
                                },
                            ]
                        },
                    ]
                },
            ]
        },
        {
            appType: 'html',
            path: '/test1',
            component: Test1,
            children: [
                {
                    path: "test2",
                    component: Test2
                }
            ]
        },
        {
            appType: 'html',
            path: '/test2(.*)',
            component: Test2
        },
        {
            appType: 'html',
            path: '/test3-:id',
            component: Test3
        },
        {
            appType: 'html',
            path: '/test4/:id/:name',
            component: Test4
            // asyncComponent: () => import('./template/test4')
        },
        {
            appType: 'html',
            path: '(.*)',
            component: All
        },
    ]
});

(window as any).router = router;

router.register('html', (router) => {
    // 服务端情况：不需要销毁实例
    // 客户端：路由跳转，调用新的应用类型时，这里需要销毁

    function render() {
        // const template = Handlebars.compile(resolveTemplate(router));
        // const node = document.createElement('div');
        // node.innerHTML = template({});

        const node = document.createElement('div');
        node.innerHTML = resolveTemplate(router);
        const target = document.getElementById('app');
        if (target) {
            target.replaceChildren(node);
        }
    }

    return {
        mount() {
            console.log('@mount');
            render();
        },
        updated() {
            console.log('@updated');
            render();
        },
        destroy() {
            console.log('@destroy');
        }
    }
});

router.init();

function replaceRouterView(template: string, child: string) {
    return template.replace(/<router-view><\/router-view>/g, child);
}
function resolveTemplate(router: RouterInstance) {
    const matched = router.route?.matched || [];
    return matched.reduce((acc, match) => {
        // const component = match.component || (match.asyncComponent && await match.asyncComponent()) || '';
        const component = match.component || '';
        if (acc === '') {
            acc = component;
        } else {
            acc = replaceRouterView(acc, component);
        }
        return acc;
    }, '');
}