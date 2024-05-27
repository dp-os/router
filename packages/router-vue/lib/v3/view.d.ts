import { type Route } from '@gez/router';
import { type PropType } from 'vue';
export declare const RouterView: import("vue").DefineComponent<{
    name: {
        type: PropType<string>;
        default: string;
    };
    route: PropType<Route>;
}, (() => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}> | import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>[] | null) | undefined, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    name: {
        type: PropType<string>;
        default: string;
    };
    route: PropType<Route>;
}>>, {
    name: string;
}, {}>;
