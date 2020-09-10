import { statuses, identifier } from "./values";

const createPrefix = (method = "get", resource) =>
  `${method}_${resource}${identifier}`.toUpperCase();

const buildAction = (resource, argsForAxios, id) => {
  const prefix = createPrefix(argsForAxios.method, resource);
  return {
    type: prefix + statuses.attempt,
    requestSettings: argsForAxios,
    id,
  };
};

export default buildAction