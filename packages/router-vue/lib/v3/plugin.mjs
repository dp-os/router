import { shallowReactive, unref } from "vue";
import { RouterLink } from "./link.mjs";
import { routerKey, routerViewLocationKey } from "./symbols.mjs";
import { RouterView } from "./view.mjs";
export function RouterVuePlugin(router) {
  return function install(app) {
    const route = shallowReactive(router.route);
    router.route = route;
    app.config.globalProperties.$router = router;
    app.config.globalProperties.$route = router.route;
    app.provide(routerKey, unref(router));
    app.provide(routerViewLocationKey, unref(router.route));
    app.component("router-view", RouterView);
    app.component("router-link", RouterLink);
  };
}
