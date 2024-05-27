/**
 *  Symbol 是否可用
 */
export const isSymbolAble =
    typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

/**
 * 判断是否是 es module 对象
 */
export function isESModule(obj: any): boolean {
    return (
        Boolean(obj.__esModule) ||
        (isSymbolAble && obj[Symbol.toStringTag] === 'Module')
    );
}
