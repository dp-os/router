import {
    type RouteRecord,
    type RouterInstance,
    type RouterRawLocation
} from '../types';
import { isPathWithProtocolOrDomain } from '../utils';
import { RouterHistory } from './base';

export class AbstractHistory extends RouterHistory {
    index: number;
    stack: RouteRecord[];

    constructor(router: RouterInstance) {
        super(router);
        this.index = -1;
        this.stack = [];
        this.init();
    }

    async init() {
        const { initUrl } = this.router.options;
        if (initUrl !== undefined) {
            // 存在 initUrl 则用 initUrl 进行初始化
            await this.replace(initUrl);
        }
    }

    destroy() {}

    // 设置监听函数
    setupListeners() {}

    // 处理外站跳转逻辑
    handleOutside(location: RouterRawLocation, replace: boolean = false) {
        const { flag, url } = isPathWithProtocolOrDomain(location);
        if (!flag) {
            return false;
        }

        // 如果有配置跳转外站函数，则执行配置函数
        const { handleOutside } = this.router.options;
        if (handleOutside) {
            handleOutside(url, replace);
        }

        return true;
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
        if (this.handleOutside(location, replace)) {
            return;
        }

        await this.transitionTo(location, (route) => {
            const index = replace ? this.index : this.index + 1;
            this.stack = this.stack.slice(0, index).concat(route);
        });
    }

    go(delta: number): void {
        const targetIndex = this.index + delta;
        // 浏览器在跳转到不存在的历史记录时不会进行跳转
        if (targetIndex < 0 || targetIndex >= this.stack.length) {
            return;
        }
        const route = this.stack[targetIndex];
        this.index = targetIndex;
        this.updateRoute(route);
    }

    /* 路由历史记录前进方法 */
    forward() {
        this.go(1);
    }

    /* 路由历史记录后退方法 */
    back() {
        this.go(-1);
    }
}
