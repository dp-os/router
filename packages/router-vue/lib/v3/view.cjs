"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RouterView = void 0;
var _vue = require("vue");
var _symbols = require("./symbols.cjs");
const RouterView = exports.RouterView = (0, _vue.defineComponent)({
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
  compatConfig: {
    MODE: 3
  },
  setup: (props, {
    attrs,
    slots
  }) => {
    const instance = (0, _vue.getCurrentInstance)();
    if (!instance) {
      console.error("no current instance");
      return;
    }
    const injectedRoute = (0, _vue.inject)(_symbols.routerViewLocationKey);
    const routeToDisplay = (0, _vue.computed)(() => props.route || injectedRoute);
    const injectedDepth = (0, _vue.inject)(_symbols.routerViewDepthKey, (0, _vue.computed)(() => 0));
    const depth = (0, _vue.computed)(() => {
      let initialDepth = injectedDepth.value;
      const {
        matched
      } = routeToDisplay.value;
      let matchedRoute;
      while ((matchedRoute = matched[initialDepth]) && !(matchedRoute == null ? void 0 : matchedRoute.component)) {
        initialDepth++;
      }
      return initialDepth;
    });
    (0, _vue.provide)(_symbols.routerViewLocationKey, (0, _vue.shallowReactive)(routeToDisplay.value));
    (0, _vue.provide)(_symbols.routerViewDepthKey, (0, _vue.computed)(() => depth.value + 1));
    return () => {
      const matchRoute = routeToDisplay.value.matched[depth.value];
      if (!matchRoute) {
        return null;
      }
      const component = (0, _vue.h)(matchRoute.component, Object.assign({}, props, attrs));
      return (
        // pass the vnode to the slot as a prop.
        // h and <component :is="..."> both accept vnodes
        normalizeSlot(slots.default, {
          Component: component
        }) || component
      );
    };
  }
});
function normalizeSlot(slot, data) {
  if (!slot) return null;
  const slotContent = slot(data);
  return slotContent.length === 1 ? slotContent[0] : slotContent;
}