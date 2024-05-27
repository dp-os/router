"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.throwNoCurrentInstance = throwNoCurrentInstance;
exports.useRoute = useRoute;
exports.useRouter = useRouter;
var _vue = require("vue");
var _symbols = require("./symbols.cjs");
function throwNoCurrentInstance(method) {
  if (!(0, _vue.getCurrentInstance)()) {
    throw new Error(`[router-vue]: Missing current instance. ${method}() must be called inside <script setup> or setup().`);
  }
}
function useRouter() {
  return (0, _vue.inject)(_symbols.routerKey);
}
function useRoute() {
  return (0, _vue.inject)(_symbols.routerViewLocationKey);
}