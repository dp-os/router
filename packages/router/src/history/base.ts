import { createTasks, type Tasks } from '../task-pipe';
import {
    type Awaitable,
    type NavigationGuard,
    type NavigationGuardAfter,
    type RouteRecord,
    type RouterInstance,
    type RouterRawLocation
} from '../types';
import {
    isEqualRoute,
    isESModule,
    isSameRoute,
    normalizeLocation
} from '../utils';

/**
 * 创建一个路由记录
 */
function createRouteRecord(route: Partial<RouteRecord> = {}): RouteRecord {
    return {
        base: '',
        path: '/',
        fullPath: '/',
        meta: {},
        matched: [],
        query: {},
        queryArray: {},
        params: {},
        hash: '',
        state: {},
        ...route
    };
}

export abstract class RouterHistory {
    /**
     * 路由类实例
     */
    public router: RouterInstance;

    /**
     * 匹配的当前路由
     */
    public current: RouteRecord = createRouteRecord();

    constructor(router: RouterInstance) {
        this.router = router;
    }

    /**
     * 更新当前路由
     */
    updateRoute(route: RouteRecord) {
        // 为了便于管理，使用同一个对象储存路由，使用 Object.assign 进行对象合并
        const newRoute = Object.assign(this.current, {
            base: route.base,
            path: route.path,
            fullPath: route.fullPath,
            query: route.query,
            queryArray: route.queryArray,
            params: route.params,
            hash: route.hash,
            state: route.state,
            component: route.component,
            asyncComponent: route.asyncComponent,
            meta: route.meta,
            redirect: route.redirect,
            matched: route.matched,
            redirectedFrom: route.redirectedFrom,
            from: route.from
        });
        this.router.updateRoute(newRoute);
    }

    /**
     * 解析路由
     */
    resolve(location: RouterRawLocation): RouteRecord {
        const rawLocation =
            typeof location === 'string' ? { path: location } : location;
        if (rawLocation.path === undefined) {
            rawLocation.path = this.current.fullPath;
        }
        const { base, ...normalizedLocation } = normalizeLocation(
            rawLocation,
            this.router.base
        );
        const route: RouteRecord = {
            ...(this.router.matcher.match(normalizedLocation, { base }) ||
                createRouteRecord({ base, fullPath: base }))
        };
        return route;
    }

    /**
     * 核心跳转方法
     */
    async transitionTo(
        location: RouterRawLocation,
        onComplete?: (route: RouteRecord) => void
    ) {
        // 寻找即将跳转路径匹配到的路由对象
        const route = this.resolve(location);

        this.abortTask();

        // 禁止重复跳转
        if (isEqualRoute(this.current, route)) {
            return;
        }

        await this.runTask(this.current, route, onComplete);
    }

    /* 当前执行的任务 */
    tasks: Tasks | null = null;

    /* 取消任务 */
    async abortTask() {
        this.tasks?.abort();
    }

    /**
     * 执行任务
     * 任务分为三部分: 前置守卫（beforeEach、beforeEnter、beforeUpdate、beforeLeave）、加载路由（loadRoute）、后置守卫（afterEach）
     * 根据触发方式不同,执行顺序分别为:
     * 进入路由时: beforeEach -> beforeEnter -> loadRoute -> afterEach
     * 更新路由时: beforeEach -> beforeUpdate -> afterEach
     * 离开路由进入新路由时: beforeLeave -> beforeEach -> beforeEnter -> loadRoute -> afterEach
     * @param from
     * @param to
     */
    async runTask(
        from: RouteRecord,
        to: RouteRecord,
        onComplete?: (route: RouteRecord) => void
    ) {
        const {
            beforeEach,
            beforeEnter,
            beforeUpdate,
            beforeLeave,
            afterEach,
            loadRoute
        } = getNavigationHooks(this.router, from, to);

        /* 前置钩子任务 */
        const guardBeforeTasks: Tasks<NavigationGuard> = createTasks();

        /* 后置钩子任务 */
        const guardAfterTasks: Tasks<NavigationGuardAfter> =
            createTasks<NavigationGuardAfter>();

        /* 加载路由任务 */
        const loadRouteTasks: Tasks<() => Awaitable<any>> =
            createTasks<() => Awaitable<any>>();

        if (isSameRoute(from, to)) {
            // from 和 to 是相同路由说明为更新路由
            guardBeforeTasks.add([...beforeEach, ...beforeUpdate]);

            guardAfterTasks.add(afterEach);
        } else {
            // 反之为进入新路由
            guardBeforeTasks.add([
                ...beforeLeave,
                ...beforeEach,
                ...beforeEnter
            ]);
            loadRouteTasks.add(loadRoute);

            guardAfterTasks.add(afterEach);
        }

        this.tasks = guardBeforeTasks;
        await guardBeforeTasks.run({
            cb: async (res) => {
                switch (typeof res) {
                    case 'boolean':
                        if (!res) {
                            this.tasks?.abort();
                        }
                        break;

                    case 'undefined':
                        break;

                    default:
                        await this.transitionTo(res, onComplete);
                        break;
                }
            },
            final: async () => {
                this.tasks = loadRouteTasks;
                await loadRouteTasks.run();
            }
        });

        if (this.tasks?.status === 'finished') {
            this.tasks = null;
            guardAfterTasks.run();

            this.updateRoute(to);
            onComplete && onComplete(to);
        }
    }

    /**
     * 跳转方法，会创建新的历史纪录
     */
    abstract push(location: RouterRawLocation): Promise<void>;

    /**
     * 跳转方法，替换当前历史记录
     */
    abstract replace(location: RouterRawLocation): Promise<void>;

    /**
     * 路由移动到指定历史记录方法
     */
    abstract go(delta: number): void;

    /* 路由历史记录前进方法 */
    abstract forward(): void;

    /* 路由历史记录后退方法 */
    abstract back(): void;

    /**
     * 初始化方法
     */
    abstract init(): Promise<void>;

    /**
     * 卸载方法
     */
    abstract destroy(): void;
}

/**
 * 获取路由导航钩子
 * 路由守卫钩子时顺序执行的，但是加载路由的钩子不依赖顺序
 */
function getNavigationHooks(
    router: RouterInstance,
    from: RouteRecord,
    to: RouteRecord
): {
    beforeEach: NavigationGuard[];
    afterEach: NavigationGuardAfter[];
    beforeEnter: NavigationGuard[];
    beforeUpdate: NavigationGuard[];
    beforeLeave: NavigationGuard[];
    loadRoute: Array<() => Promise<any>>;
} {
    const beforeEach = router.guards.beforeEach.map((guard) => {
        return () => {
            return guard(from, to);
        };
    });
    const afterEach = router.guards.afterEach.map((guard) => {
        return () => {
            return guard(from, to);
        };
    });

    const { beforeLeave } = from.matched.reduce<{
        beforeLeave: NavigationGuard[];
    }>(
        (acc, { beforeLeave }) => {
            if (beforeLeave) {
                acc.beforeLeave.unshift(() => {
                    return beforeLeave(from, to);
                });
            }
            return acc;
        },
        {
            beforeLeave: []
        }
    );

    const { beforeEnter, beforeUpdate } = to.matched.reduce<{
        beforeEnter: NavigationGuard[];
        beforeUpdate: NavigationGuard[];
    }>(
        (acc, { beforeEnter, beforeUpdate }) => {
            if (beforeEnter) {
                acc.beforeEnter.push(() => {
                    return beforeEnter(from, to);
                });
            }

            if (beforeUpdate) {
                acc.beforeUpdate.push(() => {
                    return beforeUpdate(from, to);
                });
            }
            return acc;
        },
        {
            beforeEnter: [],
            beforeUpdate: []
        }
    );

    const loadRoute = [
        async () => {
            return Promise.all(
                to.matched.reduce<Array<Promise<any>>>((acc, route) => {
                    if (!route.component && route.asyncComponent) {
                        acc.push(
                            new Promise<void>((resolve, reject) => {
                                if (!route.component && route.asyncComponent) {
                                    route.asyncComponent().then((resolved) => {
                                        if (!resolved) {
                                            reject(
                                                new Error(
                                                    `Couldn't resolve component at "${route.path}". Ensure you passed a function that returns a promise.`
                                                )
                                            );
                                        }
                                        route.component = isESModule(resolved)
                                            ? resolved.default
                                            : resolved;
                                        resolve();
                                    });
                                }
                            })
                        );
                    }
                    return acc;
                }, [])
            );
        }
    ];

    return {
        beforeEach,
        afterEach,
        beforeEnter,
        beforeUpdate,
        beforeLeave,
        loadRoute
    };
}
