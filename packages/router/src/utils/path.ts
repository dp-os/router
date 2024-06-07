import URLParse from 'url-parse';

import {
    type HistoryState,
    type RouterBase,
    type RouterLocation,
    type RouterRawLocation
} from '../types';

/**
 * 格式化路径 主要用于拼接嵌套路由的路径
 * 返回的格式化后的路径如果有协议则以协议开头，如果没有协议则以/开头
 */
export function normalizePath(path: string, parentPath?: string) {
    // 如果path以/开头 说明是绝对路径，不需要拼接路径
    // 按 Hanson 要求，不提供绝对路径
    // if (path.startsWith('/')) {
    //     return .replace(/\/{2,}/g, '/');
    // }
    let normalizedPath = parentPath ? `${parentPath}/${path}` : `${path}`;

    // 当解析的路径不是以http 或 https 协议开头时，给开头加上/
    if (!/^(https?:\/\/)/.test(normalizedPath)) {
        normalizedPath = `/${normalizedPath}`;
    }

    return (
        normalizedPath // 只有存在父级路由才进行路由拼接
            .replace(/\/{2,}/g, '/') // 将多个斜杠 / 替换为单个斜杠 /
            .replace(/\/$/, '') || // 移除结尾的斜杠 /
        '/' // 为空字符串时至少返回单个 /
    );
}

/**
 * 路径解析方法
 * @example 输入 https://www.google.com/test1/test2?a=1&b=2#123 输出 { pathname: '/test1/test2', query: { a: '1', b: '2' }, queryArray: { a: ['1'], b: ['2'] }, hash: '123' }
 * 输入 /test1/test2?a=1&b=2#123 同样输出 { pathname: '/test1/test2', query: { a: '1', b: '2' }, queryArray: { a: ['1'], b: ['2'] }, hash: '123' }
 */
export function parsePath(path: string = ''): {
    pathname: string;
    query: Record<string, string>;
    queryArray: Record<string, string[]>;
    hash: string;
} {
    path = normalizePath(path);
    const { pathname, query, hash } = new URLParse(path || '/');
    const queryObj = {};
    const queryArray = {};
    if (query.length > 0) {
        query
            .slice(1)
            .split('&')
            .forEach((item) => {
                const [key, value] = item.split('=');
                if (key) {
                    queryObj[key] = value;
                    queryArray[key] = (queryArray[key] || []).concat(value);
                }
                // queryArray[key] = [
                //     ...(queryArray[key] || []),
                //     ...(value !== undefined ? [value] : [])
                // ];
            });
    }
    return {
        pathname,
        query: queryObj,
        queryArray,
        hash
    };
}

/**
 * 将path query hash合并为完整路径
 * @example stringifyPath({ pathname: '/news', query: { a: '1' }, hash: '123' }) 输出 '/news?a=1#123'
 */
export function stringifyPath(
    {
        pathname = '',
        query = {},
        queryArray = {},
        hash = ''
    }: {
        pathname: string;
        /* 按 Hanson 要求加入 undefined 类型 */
        query: Record<string, string | undefined>;
        queryArray: Record<string, string[]>;
        hash: string;
    } = {
        pathname: '',
        query: {},
        queryArray: {},
        hash: ''
    }
): string {
    const queryString = Object.entries(
        Object.assign({}, query, queryArray)
    ).reduce((acc, [key, value]) => {
        return acc ? `${acc}&${key}=${value}` : `?${key}=${value}`;
    }, '');
    const hashString = hash ? (hash.startsWith('#') ? hash : `#${hash}`) : '';
    return `${pathname}${queryString}${hashString}`;
}

/**
 * 标准化 RouterLocation 字段
 */
export function normalizeLocation(
    rawLocation: RouterRawLocation,
    base: RouterBase = ''
): RouterLocation & { path: string; base: string } {
    let pathname: string = '';
    /* 按 Hanson 要求加入 undefined 类型 */
    let query: Record<string, string | undefined> = {};
    let queryArray: Record<string, string[]> = {};
    let hash: string = '';
    let params: Record<string, string> | undefined;
    let state: HistoryState = {};

    if (typeof rawLocation === 'object') {
        const parsedOption = parsePath(rawLocation.path);
        pathname = parsedOption.pathname;

        // 只有在rawLocation初始传入了 query 或 queryArray 时才使用 rawLocation
        if (rawLocation.query || rawLocation.queryArray) {
            queryArray = rawLocation.queryArray || {};
            query = rawLocation.query || {};
        } else {
            queryArray = parsedOption.queryArray;
            query = parsedOption.query;
        }

        hash = rawLocation.hash || parsedOption.hash;

        params = rawLocation.params; // params 不使用默认值
        state = rawLocation.state || {};
    } else {
        const parsedOption = parsePath(rawLocation);
        pathname = parsedOption.pathname;
        query = parsedOption.query;
        queryArray = parsedOption.queryArray;
        hash = parsedOption.hash;
    }

    console.log('normalizeLocation', rawLocation, pathname, query, queryArray);

    const fullPath = stringifyPath({
        pathname,
        query,
        queryArray,
        hash
    });
    const baseString = normalizePath(
        typeof base === 'function'
            ? base({
                  fullPath,
                  query,
                  queryArray,
                  hash
              })
            : base
    );
    const path = normalizePath(
        pathname.replace(new RegExp(`^(${baseString})`), '')
    );

    const { query: realQuery, queryArray: realQueryArray } =
        parsePath(fullPath);

    const res: RouterLocation & { path: string; base: string } = {
        base: baseString,
        path,
        query: realQuery,
        queryArray: realQueryArray,
        hash,
        state
    };
    if (params) res.params = params;
    return res;
}
