import URLParse from 'url-parse';

import { createHistory } from './history';
import { createRouterMatcher } from './matcher';
import {
    type NavigationGuard,
    type NavigationGuardAfter,
    type RegisteredConfig,
    type RegisteredConfigMap,
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
import { inBrowser, normalizePath, regexDomain } from './utils';

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
                return {
                    left: 0,
                    top: 0
                };
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

        if (registerConfig) {
            const { mounted, generator } = registerConfig;
            if (!mounted) {
                registerConfig.config = generator(this);
                registerConfig.config?.mount();
                registerConfig.mounted = true;
            }
            registerConfig.config?.updated();
        }

        if (curAppType !== appType && curRegisterConfig) {
            curRegisterConfig.config?.destroy();
            curRegisterConfig.mounted = false;
        }
    }

    /* 应用路由 */
    protected applyRoute(route: RouteRecord) {
        let url = '';
        const { fullPath } = route;
        if (inBrowser && !regexDomain.test(fullPath)) {
            url = normalizePath(fullPath, location.origin);
        } else {
            url = normalizePath(fullPath);
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
    protected registeredConfigMap: RegisteredConfigMap = {};

    /* app配置注册 */
    register(
        name: string,
        config: (router: RouterInstance) => RegisteredConfig
    ) {
        this.registeredConfigMap[name] = {
            generator: config,
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

    /* 卸载全局路由前置守卫 */
    unBindBeforeEach(guard: NavigationGuard) {
        const i = this.guards.beforeEach.findIndex((item) => item === guard);
        this.guards.beforeEach.splice(i, 1);
    }

    /* 注册全局路由后置守卫 */
    afterEach(guard: NavigationGuardAfter) {
        this.guards.afterEach.push(guard);
    }

    /* 卸载全局路由后置守卫 */
    unBindAfterEach(guard: NavigationGuardAfter) {
        const i = this.guards.afterEach.findIndex((item) => item === guard);
        this.guards.afterEach.splice(i, 1);
    }

    /* 路由跳转方法，会创建新的历史记录 */
    async push(location: RouterRawLocation) {
        await this.history.push(location);
    }

    /* 路由跳转方法，会替换当前的历史记录 */
    async replace(location: RouterRawLocation) {
        await this.history.replace(location);
    }

    /**
     * 新开浏览器窗口的方法，在服务端会调用 push 作为替代
     */
    pushWindow(location: RouterRawLocation) {
        this.history.pushWindow(location);
    }

    /**
     * 替换当前浏览器窗口的方法，在服务端会调用 replace 作为替代
     */
    replaceWindow(location: RouterRawLocation) {
        this.history.replaceWindow(location);
    }

    /* 前往特定路由历史记录的方法，可以在历史记录前后移动 */
    go(delta: number = 0) {
        this.history.go(delta);
    }

    /* 路由历史记录前进方法 */
    forward() {
        this.history.forward();
    }

    /* 路由历史记录后退方法 */
    back() {
        this.history.back();
    }

    /* 根据获取当前所有活跃的路由Record对象 */
    getRoutes() {
        return this.matcher.getRoutes();
    }
}

export function createRouter(options: RouterOptions): RouterInstance {
    return new Router(options);
}
