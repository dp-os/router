import { type RouterRawLocation } from '../types';
import { normalizeLocation } from '../utils';
import { RouterHistory } from './base';

export class HtmlHistory extends RouterHistory {
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

    onPopState() {
        // 当路由变化时触发跳转事件
        this.transitionTo(this.getCurrentLocation());
    }

    init() {
        // 初始化时替换当前历史记录，目的是将 base 错误的路径修改为 base正确的路径时 不创建新的历史记录
        this.replace(this.getCurrentLocation());
        this.setupListeners();
    }

    // 设置监听函数
    setupListeners() {
        window.addEventListener('popstate', this.onPopState.bind(this));
    }

    destroy() {
        window.removeEventListener('popstate', this.onPopState);
    }

    push(location: RouterRawLocation) {
        this.transitionTo(location, (route) => {
            const state = route.state || history.state || {};
            window.history.pushState(state, '', route.fullPath);
        });
    }

    // 替换当前路由记录跳转
    replace(location: RouterRawLocation) {
        this.transitionTo(location, (route) => {
            const state = route.state || history.state || {};
            window.history.replaceState(state, '', route.fullPath);
        });
    }

    go(delta: number): void {
        window.history.go(delta);
    }
}
