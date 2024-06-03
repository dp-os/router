import URLParse from 'url-parse';

import { createHistory } from './history';
import { createRouterMatcher } from './matcher';
import {
    type NavigationGuard,
    type NavigationGuardAfter,
    type RegisteredConfig,
    type Route,
    type RouterBase,
    type RouteRecord,
    type RouterHistory,
    type RouterInstance,
    type RouterMatcher,
    RouterMode,
    type RouterOptions,
    type RouterRawLocation,
    type RouterScrollBehavior
} from './types';
import { inBrowser, normalizePath } from './utils';

/**
 * 路由类
 */
class Router {
    /* 路由配置 */
    options: RouterOptions;

    /**
     * 路由固定前置路径
     * 需要注意的是如果使用函数返回 base，需要尽量保证相同的路径返回相同base
     */
    base: RouterBase;

    /* 路由模式 */
    mode: RouterMode;

    /* 路由匹配器 */
    matcher: RouterMatcher;

    /* 路由history类 */
    history: RouterHistory;

    /* 滚动行为 */
    scrollBehavior: RouterScrollBehavior;

    /* 当前路由信息 */
    route: Route = {
        href: '',
        origin: '',
        host: '',
        protocol: '',
        hostname: '',
        port: '',
        pathname: '',
        search: '',
        hash: '',

        params: {},
        query: {},
        queryArray: {},
        state: {},
        meta: {},
        base: '',
        path: '',
        fullPath: '',
        matched: []
    };

    constructor(options: RouterOptions) {
        this.options = options;
        this.matcher = createRouterMatcher(options.routes || []);

        this.mode =
            options.mode ||
            (inBrowser ? RouterMode.HISTORY : RouterMode.ABSTRACT);

        this.base = options.base || '';

        this.scrollBehavior =
            options.scrollBehavior ||
            ((to, from, savedPosition) => {
                if (savedPosition) return savedPosition;
                return false;
            });

        this.history = createHistory({
            router: this,
            mode: this.mode
        });
    }

    /* 更新路由 */
    updateRoute(route: RouteRecord) {
        const curAppType = this.route?.matched[0]?.appType;
        const appType = route.matched[0]?.appType;
        this.applyRoute(route);

        const curRegisterConfig =
            curAppType && this.registeredConfigMap[curAppType];
        const registerConfig = appType && this.registeredConfigMap[appType];

        if (curAppType !== appType && curRegisterConfig) {
            curRegisterConfig.destroy();
            curRegisterConfig.mounted = false;
        }

        if (registerConfig) {
            if (!registerConfig.mounted) {
                registerConfig.mount();
                registerConfig.mounted = true;
            }
            registerConfig.updated();
        }
    }

    /* 应用路由 */
    protected applyRoute(route: RouteRecord) {
        let url = '';
        if (inBrowser) {
            url = normalizePath(route.fullPath, location.origin);
        } else {
            url = normalizePath(route.fullPath);
        }

        const {
            hash,
            host,
            hostname,
            href,
            origin,
            pathname,
            port,
            protocol,
            query
        } = new URLParse(url);
        Object.assign(
            this.route,
            {
                href,
                origin,
                host,
                protocol,
                hostname,
                port,
                pathname,
                search: query,
                hash
            },
            route
        );
    }

    /* 解析路由 */
    resolve(location: RouterRawLocation): RouteRecord {
        return this.history.resolve(location);
    }

    // 注册多个路由
    // addRoutes(routes: RouteConfig[]) {
    //     this.matcher.addRoutes(routes);
    // }

    // 注册路由
    // addRoute(route: RouteConfig): void {
    //     this.matcher.addRoute(route);
    // }

    /* 初始化 */
    async init() {
        await this.history.init();
    }

    /* 已注册的app配置 */
    protected registeredConfigMap: Record<
        string,
        RegisteredConfig & { mounted: boolean }
    > = {};

    /* app配置注册 */
    register(name: string, config: (router: Router) => RegisteredConfig) {
        this.registeredConfigMap[name] = {
            ...config(this),
            mounted: false
        };
    }

    /* 全局路由守卫 */
    readonly guards: {
        beforeEach: NavigationGuard[];
        afterEach: NavigationGuardAfter[];
    } = {
        beforeEach: [],
        afterEach: []
    };

    /* 注册全局路由前置守卫 */
    beforeEach(guard: NavigationGuard) {
        this.guards.beforeEach.push(guard);
    }

    /* 注册全局路由后置守卫 */
    afterEach(guard: NavigationGuardAfter) {
        this.guards.afterEach.push(guard);
    }

    /* 路由跳转方法，会创建新的历史记录 */
    async push(location: RouterRawLocation) {
        await this.history.push(location);
    }

    /* 路由跳转方法，会替换当前的历史记录 */
    async replace(location: RouterRawLocation) {
        await this.history.replace(location);
    }

    /* 前往特定路由历史记录的方法，可以在历史记录前后移动 */
    go(delta: number = 0) {
        this.history.go(delta);
    }

    /* 路由历史记录前进方法 */
    forward() {
        this.history.go(1);
    }

    /* 路由历史记录后退方法 */
    back() {
        this.history.go(-1);
    }

    /* 根据获取当前所有活跃的路由Record对象 */
    getRoutes() {
        return this.matcher.getRoutes();
    }
}

export function createRouter(options: RouterOptions): RouterInstance {
    return new Router(options);
}
