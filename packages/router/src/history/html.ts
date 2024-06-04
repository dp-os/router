import { type RouterInstance, type RouterRawLocation } from '../types';
import {
    computeScrollPosition,
    getKeepScrollPosition,
    getSavedScrollPosition,
    normalizeLocation,
    saveScrollPosition,
    scrollToPosition
} from '../utils';
import { RouterHistory } from './base';

export class HtmlHistory extends RouterHistory {
    constructor(router: RouterInstance) {
        super(router);

        if ('scrollRestoration' in window.history) {
            // 只有在 html 模式下才需要修改历史滚动模式
            window.history.scrollRestoration = 'manual';
        }
    }

    // 获取当前地址，包括 path query hash
    getCurrentLocation() {
        const { href } = window.location;
        const { state } = window.history;
        const { path, base, ...rest } = normalizeLocation(
            href,
            this.router.base
        );
        return {
            path: path.replace(new RegExp(`^(${base})`), ''),
            base,
            ...rest,
            state
        };
    }

    onPopState(e: PopStateEvent) {
        const current = Object.assign({}, this.current);
        // 当路由变化时触发跳转事件
        this.transitionTo(this.getCurrentLocation(), (route) => {
            saveScrollPosition(current.fullPath, computeScrollPosition());
            setTimeout(async () => {
                const keepScrollPosition = history.state.keepScrollPosition;
                if (keepScrollPosition) {
                    return;
                }
                const savedPosition = getSavedScrollPosition(route.fullPath);
                const position = await this.router.scrollBehavior(
                    current,
                    route,
                    savedPosition
                );
                position && scrollToPosition(position);
            });
        });
    }

    async init() {
        // 初始化时替换当前历史记录，目的是将 base 错误的路径修改为 base正确的路径时 不创建新的历史记录
        await this.replace(this.getCurrentLocation());
        this.setupListeners();
    }

    // 设置监听函数
    setupListeners() {
        window.addEventListener('popstate', this.onPopState.bind(this));
    }

    destroy() {
        window.removeEventListener('popstate', this.onPopState);
    }

    // 新增路由记录跳转
    async push(location: RouterRawLocation) {
        await this.jump(location, false);
    }

    // 替换当前路由记录跳转
    async replace(location: RouterRawLocation) {
        await this.jump(location, true);
    }

    // 跳转方法
    async jump(location: RouterRawLocation, replace: boolean = false) {
        const current = Object.assign({}, this.current);
        await this.transitionTo(location, (route) => {
            const keepScrollPosition = getKeepScrollPosition(location);
            if (!keepScrollPosition) {
                saveScrollPosition(current.fullPath, computeScrollPosition());
            }

            const state = route.state || history.state || {};
            window.history[replace ? 'replaceState' : 'pushState'](
                Object.assign(state, { keepScrollPosition }),
                '',
                route.fullPath
            );
        });
    }

    go(delta: number): void {
        window.history.go(delta);
    }

    forward(): void {
        window.history.forward();
    }

    protected timer: NodeJS.Timeout | null = null;

    back(): void {
        const oldState = history.state;
        window.history.back();
        this.timer = setTimeout(() => {
            if (history.state === oldState) {
                const noBackNavigation = this.router.options.noBackNavigation;
                noBackNavigation && noBackNavigation();
            }
            this.timer = null;
        }, 80);
    }
}
