"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RouterLink = void 0;
var _router = require("@gez/router");
var _vue = require("vue");
var _use = require("./use.cjs");
const RouterLink = exports.RouterLink = (0, _vue.defineComponent)({
  functional: true,
  props: {
    to: {
      type: String,
      required: true
    },
    tag: {
      type: String,
      default: "a"
    },
    replace: {
      type: Boolean,
      default: false
    },
    exact: {
      type: String,
      default: "include"
    },
    // append: {
    //     type: Boolean as PropType<boolean>,
    //     default: false
    // },
    activeClass: {
      type: String,
      default: "router-link-active"
    },
    event: {
      type: String,
      default: "click"
    }
  },
  render(h, ctx) {
    const {
      to,
      tag,
      replace,
      exact,
      activeClass,
      event
    } = ctx.props;
    const router = (0, _use.useRouter)();
    const current = (0, _use.useRoute)();
    const resolveRoute = router.resolve(to);
    let compare;
    switch (exact) {
      case "route":
        compare = _router.isSameRoute;
        break;
      case "exact":
        compare = _router.isEqualRoute;
        break;
      case "include":
      default:
        compare = (current2, route) => {
          return current2.fullPath.startsWith(route.fullPath);
        };
        break;
    }
    const active = compare(current, resolveRoute);
    const handler = e => {
      if (guardEvent(e)) {
        router[replace ? "replace" : "push"](to);
      }
    };
    const on = {};
    const eventTypeList = getEventTypeList(event);
    eventTypeList.forEach(eventName => {
      on[eventName.toLocaleLowerCase()] = handler;
    });
    return h(tag, {
      class: ["router-link", {
        [activeClass]: active
      }],
      attrs: {
        href: resolveRoute.fullPath
      },
      on
    }, ctx.children);
  }
});
function getEventTypeList(eventType) {
  if (eventType instanceof Array) {
    if (eventType.length > 0) {
      return eventType;
    }
    return ["click"];
  }
  return [eventType || "click"];
}
function guardEvent(e) {
  var _a;
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return;
  if (e.defaultPrevented) return;
  if (e.button !== void 0 && e.button !== 0) return;
  if ((_a = e.currentTarget) == null ? void 0 : _a.getAttribute) {
    const target = e.currentTarget.getAttribute("target");
    if (/\b_blank\b/i.test(target)) return;
  }
  if (e.preventDefault) e.preventDefault();
  return true;
}