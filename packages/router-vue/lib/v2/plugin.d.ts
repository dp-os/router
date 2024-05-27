import type { Route, RouterInstance } from '@gez/router';
import { type VueConstructor } from 'vue';
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
    interface ComponentOptions {
        router?: RouterInstance;
    }
}
export declare class RouterVuePlugin {
    static installed: boolean;
    static _Vue: VueConstructor;
    static install(Vue: VueConstructor): void;
}
export {};
