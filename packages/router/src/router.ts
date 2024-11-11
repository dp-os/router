import URLParse from 'url-parse';

import { createHistory } from './history';
import { createRouterMatcher } from './matcher';
import {
    type HistoryState,
    type NavigationGuard,
    type NavigationGuardAfter,
    type RegisteredConfig,
    type RegisteredConfigMap,
    type Route,
    type RouterBase,
    type RouteRecord,
    type RouterHistory,
    type RouterInitOptions,
    type RouterInstance,
    type RouterMatcher,
    RouterMode,
    type RouterOptions,
    type RouterRawLocation,
    type RouterScrollBehavior
} from './types';
import { inBrowser, normalizePath, regexDomain } from './utils';

const LayerConfigKey = '__layer_config_key';

let layerId = 0;

function getLatestLayerId() {
    return ++layerId;
}

/**
 * 路由类
 */
class Router implements RouterInstance {
    /**
     * 当前路由对象的上级路由对象
     */
    parent: RouterInstance | null = null;

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

                this.layerMap[this.layerId] = {
                    router: this,
                    config: registerConfig.config,
                    destroyed: false
                };
                this.layerConfigList.push({
                    id: this.layerId,
                    depth: 0
                });
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
    async init(options: RouterInitOptions = {}) {
        const { parent = null, route, replace = true } = options;

        await this.history.init({
            replace
        });

        const layerId = getLatestLayerId();
        let layerMap: RouterInstance['layerMap'] = {};
        let layerConfigList: RouterInstance['layerConfigList'] = [];
        if (parent && route) {
            const appType = route.matched[0]?.appType;
            if (!appType) return;
            const registerConfig = parent.registeredConfigMap[appType];
            if (!registerConfig) return;

            parent.freeze();
            this.registeredConfigMap = parent.registeredConfigMap;
            const { generator } = registerConfig;
            const config = generator(this);
            config.mount();
            config.updated();
            layerMap = parent.layerMap;

            layerMap[layerId] = {
                router: this,
                config,
                destroyed: false
            };
            layerConfigList = parent.layerConfigList;
        }
        layerConfigList.push({
            id: layerId,
            depth: 0
        });
        this.parent = parent;
        this.layerId = layerId;
        this.layerMap = layerMap;
        this.layerConfigList = layerConfigList;

        console.log('@init', layerId);
    }

    /* 已注册的app配置 */
    registeredConfigMap: RegisteredConfigMap = {};

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
     * 当前路由弹层id，用于区分不同的路由弹层
     */
    layerId: number = layerId;

    /**
     * 路由弹层配置
     * key为路由弹层id
     */
    layerConfigList: Array<{
        /**
         * 路由弹层id
         */
        id: number;
        /**
         * 路由弹层深度
         */
        depth: number;
    }> = [];

    /**
     * 路由弹层id与路由实例的map
     */
    layerMap: Record<
        number,
        {
            router: RouterInstance;
            config: RegisteredConfig;
            destroyed: boolean;
        }
    > = {};

    /**
     * 路由是否冻结
     */
    isFrozen: boolean = false;

    /**
     * 路由冻结方法
     */
    freeze() {
        this.isFrozen = true;
    }

    /**
     * 路由解冻方法
     */
    unfreeze() {
        this.isFrozen = false;
    }

    /**
     * 打开路由弹层方法，会创建新的路由实例并调用注册的 register 方法
     * 服务端会使用 push 作为替代
     */
    async pushLayer(location: RouterRawLocation) {
        const route = this.resolve(location);
        if (route.fullPath === this.route.fullPath) return;
        if (!inBrowser) {
            this.push(location);
            return;
        }
        const router = createRouter({
            ...this.options,
            initUrl: route.fullPath
        });
        await router.init({ parent: this, route, replace: false });
    }

    async destroy() {
        const index = this.layerConfigList.findIndex(
            (item) => item.id === this.layerId
        );
        console.log(
            '@destroy',
            this.layerId,
            index,
            this.layerConfigList,
            this.layerMap
        );
        // if (index > -1) this.layerConfigList.splice(index, 1);
    }

    /**
     * 更新路由弹层方法
     * @param state 参数为history.state
     * @description 没有传入 state 时使用当前配置更新 history.state，传入了 state 时使用传入的 state 更新当前配置
     */
    async updateLayerState(route: RouteRecord, state?: HistoryState) {
        if (state) {
            const stateLayerConfigList =
                (state[LayerConfigKey] as typeof this.layerConfigList) || [];
            console.log(
                '@updateLayerState',
                stateLayerConfigList.map(({ id }) => id),
                Object.keys(this.layerMap)
            );
            const destroyList = this.layerConfigList.filter(({ id }) =>
                stateLayerConfigList.every((item) => item.id !== id)
            );
            const createList = stateLayerConfigList.filter(({ id }) =>
                this.layerConfigList.every((item) => item.id !== id)
            );

            const existingList = stateLayerConfigList.filter(({ id }) =>
                this.layerConfigList.some((item) => item.id === id)
            );
            const activeId = Math.max(...existingList.map(({ id }) => id));
            console.log(
                '@activeId',
                activeId,
                existingList.map(({ id }) => id)
            );
            this.layerConfigList.forEach(({ id }, index, arr) => {
                const layer = this.layerMap[id];
                if (layer) {
                    const { router } = layer;
                    if (activeId === id) {
                        router.unfreeze();
                    } else {
                        router.freeze();
                    }
                }
            });

            destroyList.forEach(({ id }) => {
                const layer = this.layerMap[id];
                if (layer && !layer.destroyed) {
                    const { router, config } = layer;
                    config.destroy();
                    router.destroy();
                    layer.destroyed = true;
                }
            });

            createList.forEach(({ id }) => {
                const layer = this.layerMap[id];
                if (layer && layer.destroyed) {
                    const { router, config } = layer;
                    router.updateLayerState(route);
                    config.mount();
                    layer.destroyed = false;
                }
            });

            const allIdList = Object.keys(this.layerMap);
            const layerConfigIdList = this.layerConfigList.map(({ id }) => id);
            const createIdList = createList.map(({ id }) => id);
            const destroyIdList = destroyList.map(({ id }) => id);

            console.log('@allIdList =>', allIdList);
            console.log('@layerConfigList =>', layerConfigIdList);
            console.log('@createList =>', createIdList);
            console.log('@destroyList =>', destroyIdList);

            this.layerConfigList = stateLayerConfigList as any;
        } else {
            const layerConfig = this.layerConfigList.find(
                (item) => item.id === this.layerId
            );
            if (layerConfig) layerConfig.depth++;
            const state = {
                ...history.state,
                [LayerConfigKey]: this.layerConfigList
            };
            window.history.replaceState(state, '', route.fullPath);
        }
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
