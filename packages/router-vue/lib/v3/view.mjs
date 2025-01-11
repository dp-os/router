import {
  computed,
  defineComponent,
  getCurrentInstance,
  h,
  inject,
  provide,
  shallowReactive
} from "vue";
import { routerViewDepthKey, routerViewLocationKey } from "./symbols.mjs";
export const RouterView = defineComponent({
  name: "RouterView",
  inheritAttrs: true,
  props: {
    name: {
      type: String,
      default: "default"
    },
    route: Object
  },
  // Better compat for @vue/compat users
  // https://github.com/vuejs/router/issues/1315
  compatConfig: { MODE: 3 },
  setup: (props, { attrs, slots }) => {
    const instance = getCurrentInstance();
    if (!instance) {
      console.error("no current instance");
      return;
    }
    const injectedRoute = inject(
      routerViewLocationKey
    );
    const routeToDisplay = computed(
      () => props.route || injectedRoute
    );
    const injectedDepth = inject(
      routerViewDepthKey,
      computed(() => 0)
    );
    const depth = computed(() => {
      let initialDepth = injectedDepth.value;
      const { matched } = routeToDisplay.value;
      let matchedRoute;
      while ((matchedRoute = matched[initialDepth]) && !(matchedRoute == null ? void 0 : matchedRoute.component)) {
        initialDepth++;
      }
      return initialDepth;
    });
    provide(routerViewLocationKey, shallowReactive(routeToDisplay.value));
    provide(
      routerViewDepthKey,
      computed(() => depth.value + 1)
    );
    return () => {
      const matchRoute = routeToDisplay.value.matched[depth.value];
      if (!matchRoute) {
        return null;
      }
      const component = h(
        matchRoute.component,
        Object.assign({}, props, attrs)
      );
      return (
        // pass the vnode to the slot as a prop.
        // h and <component :is="..."> both accept vnodes
        normalizeSlot(slots.default, { Component: component }) || component
      );
    };
  }
});
function normalizeSlot(slot, data) {
  if (!slot) return null;
  const slotContent = slot(data);
  return slotContent.length === 1 ? slotContent[0] : slotContent;
}
