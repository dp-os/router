import type { Route, RouterInstance } from '@gez/router';
import { type VueConstructor } from 'vue';

import { RouterLink } from './link';
import { RouterView } from './view';

interface VueWithRouter extends Vue {
    _routerRoot: VueWithRouter;
    _router: RouterInstance;
    _route: Route;
    $parent: VueWithRouter | null;
}

declare module 'vue/types/vue' {
    interface Vue {
        readonly $router: RouterInstance;
        readonly $route: Route;
        _routerRoot: VueWithRouter;
        readonly _router: RouterInstance;
        readonly _route: Route;
    }
}

declare module 'vue/types/options' {
    // @ts-expect-error
    interface ComponentOptions {
        router?: RouterInstance;
    }
}

export class RouterVuePlugin {
    static installed: boolean;
    static _Vue: VueConstructor;

    static install(Vue: VueConstructor) {
        // 已安装则跳出
        if (this.installed && this._Vue === Vue) return;

        // 首次installed时
        this.installed = true;
        this._Vue = Vue;

        Vue.mixin({
            beforeCreate() {
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                if (this.$options.router) {
                    // 只有根组件实例才会在 options 中存在 router 对象
                    this._routerRoot = this;
                    this._routerRoot._router = this.$options.router;
                    // 将 route 设置为响应式属性
                    (Vue.util as any).defineReactive(
                        this,
                        '_route',
                        this._router.route
                    );
                } else {
                    // 非根组件实例
                    this.$parent &&
                        (this._routerRoot = this.$parent._routerRoot);
                }
            }
        });

        // 注册组件
        Vue.component('router-view', RouterView);
        Vue.component('router-link', RouterLink);

        // 定义原型$router对象
        Object.defineProperty(Vue.prototype, '$router', {
            get() {
                return this._routerRoot._router;
            }
        });

        // 定义原型$route对象
        Object.defineProperty(Vue.prototype, '$route', {
            get() {
                return this._routerRoot._route;
            }
        });
    }
}
