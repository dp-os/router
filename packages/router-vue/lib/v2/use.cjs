"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.throwNoCurrentInstance = throwNoCurrentInstance;
exports.useRoute = useRoute;
exports.useRouter = useRouter;
var _vue = require("vue");
function throwNoCurrentInstance(method) {
  if (!(0, _vue.getCurrentInstance)()) {
    throw new Error(`[router-vue]: Missing current instance. ${method}() must be called inside <script setup> or setup().`);
  }
}
function useRouter() {
  if (process.env.NODE_ENV !== "production") {
    throwNoCurrentInstance("useRouter");
  }
  const vueInstance = (0, _vue.getCurrentInstance)();
  return vueInstance.proxy.$root.$router;
}
function useRoute() {
  if (process.env.NODE_ENV !== "production") {
    throwNoCurrentInstance("useRoute");
  }
  const vueInstance = (0, _vue.getCurrentInstance)();
  return vueInstance.proxy.$root.$route;
}