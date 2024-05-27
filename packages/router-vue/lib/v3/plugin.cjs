"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RouterVuePlugin = RouterVuePlugin;
var _vue = require("vue");
var _link = require("./link.cjs");
var _symbols = require("./symbols.cjs");
var _view = require("./view.cjs");
function RouterVuePlugin(router) {
  return function install(app) {
    const route = (0, _vue.shallowReactive)(router.route);
    router.route = route;
    app.config.globalProperties.$router = router;
    app.config.globalProperties.$route = router.route;
    app.provide(_symbols.routerKey, (0, _vue.unref)(router));
    app.provide(_symbols.routerViewLocationKey, (0, _vue.unref)(router.route));
    app.component("router-view", _view.RouterView);
    app.component("router-link", _link.RouterLink);
  };
}