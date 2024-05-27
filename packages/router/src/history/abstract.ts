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

    init() {}

    destroy() {}

    // 设置监听函数
    setupListeners() {}

    push(location: RouterRawLocation) {
        this.transitionTo(location, (route) => {
            this.stack = this.stack.slice(0, this.index + 1).concat(route);
            this.index++;
        });
    }

    // 替换当前路由记录跳转
    replace(location: RouterRawLocation) {
        this.transitionTo(location, (route) => {
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
}
