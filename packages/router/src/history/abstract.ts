import {
    type RouteRecord,
    type RouterInstance,
    type RouterRawLocation
} from '../types';
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

    async init() {}

    destroy() {}

    // 设置监听函数
    setupListeners() {}

    async push(location: RouterRawLocation) {
        await this.transitionTo(location, (route) => {
            this.stack = this.stack.slice(0, this.index + 1).concat(route);
            this.index++;
        });
    }

    // 替换当前路由记录跳转
    async replace(location: RouterRawLocation) {
        await this.transitionTo(location, (route) => {
            this.stack = this.stack.slice(0, this.index).concat(route);
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
