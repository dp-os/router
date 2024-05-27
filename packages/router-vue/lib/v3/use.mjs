import { getCurrentInstance, inject } from "vue";
import { routerKey, routerViewLocationKey } from "./symbols.mjs";
export function throwNoCurrentInstance(method) {
  if (!getCurrentInstance()) {
    throw new Error(
      `[router-vue]: Missing current instance. ${method}() must be called inside <script setup> or setup().`
    );
  }
}
export function useRouter() {
  return inject(routerKey);
}
export function useRoute() {
  return inject(routerViewLocationKey);
}
