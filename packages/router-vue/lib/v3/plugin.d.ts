import type { Route, RouterInstance } from '@gez/router';
import { type App, type ShallowReactive } from 'vue';
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $route: ShallowReactive<Route>;
        $router: RouterInstance;
    }
    interface GlobalComponents {
    }
}
export declare function RouterVuePlugin(router: RouterInstance): (app: App) => void;
