import {
    type _ScrollPositionNormalized,
    type RouteRecord,
    ScrollBehaviorHandler,
    type ScrollPosition,
    type ScrollPositionCoordinates
} from '../types';

/**
 * 获取当前滚动位置
 */
export const computeScrollPosition = (): _ScrollPositionNormalized => ({
    left: window.scrollX,
    top: window.scrollY
});

/**
 * 获取元素位置
 */
function getElementPosition(
    el: Element,
    offset: ScrollPositionCoordinates
): _ScrollPositionNormalized {
    const docRect = document.documentElement.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    return {
        behavior: offset.behavior,
        left: elRect.left - docRect.left - (offset.left || 0),
        top: elRect.top - docRect.top - (offset.top || 0)
    };
}

/**
 * 滚动到指定位置
 */
export function scrollToPosition(position: ScrollPosition): void {
    let scrollToOptions: ScrollPositionCoordinates;

    if ('el' in position) {
        const positionEl = position.el;
        const isIdSelector =
            typeof positionEl === 'string' && positionEl.startsWith('#');

        const el =
            typeof positionEl === 'string'
                ? isIdSelector
                    ? document.getElementById(positionEl.slice(1))
                    : document.querySelector(positionEl)
                : positionEl;

        if (!el) {
            return;
        }
        scrollToOptions = getElementPosition(el, position);
    } else {
        scrollToOptions = position;
    }

    if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo(scrollToOptions);
    } else {
        window.scrollTo(
            scrollToOptions.left != null
                ? scrollToOptions.left
                : window.scrollX,
            scrollToOptions.top != null ? scrollToOptions.top : window.scrollY
        );
    }
}

/**
 * 存储的滚动位置
 */
export const scrollPositions = new Map<string, _ScrollPositionNormalized>();

/**
 * 保存滚动位置
 */
export function saveScrollPosition(
    key: string,
    scrollPosition: _ScrollPositionNormalized
) {
    scrollPositions.set(key, scrollPosition);
    console.log('saveScrollPosition', key, scrollPositions);
    return scrollPositions;
}

/**
 * 获取存储的滚动位置
 */
export function getSavedScrollPosition(key: string) {
    const scroll = scrollPositions.get(key);
    // 保存的滚动位置信息不应当被多次使用, 下一次应当使用新保存的位置信息
    scrollPositions.delete(key);
    console.log('getSavedScrollPosition', key, scroll);
    return scroll || null;
}
