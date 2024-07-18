import Application from "./application";
export { default as Route } from "./Route";
export { default as request } from "./request";

export default {
  create() {
    return new Application();
  },
};
