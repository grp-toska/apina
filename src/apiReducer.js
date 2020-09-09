import { statuses, identifier } from "./values";

const handle = (data, oldValue) => {
  const get = () => {
    if (Array.isArray(data)) return data; // Assume get all resources

    return [...oldValue.filter((item) => item.id !== data.id), data];
  };

  const post = () => {
    return [...oldValue.filter((item) => item.id !== data.id), data];
  };

  const put = () => {
    return [...oldValue.filter((item) => item.id !== data.id), data];
  };

  const remove = () => {
    return oldValue.filter((item) => item.id !== data.id);
  };

  return { get, post, put, remove };
};

const getSuccess = (data, oldValue, method) => {
  const { get, post, put, remove } = handle(data, oldValue);

  switch (method) {
    case "GET":
      return get();
    case "POST":
      return post();
    case "PUT":
      return put();
    case "DELETE":
      return remove();
    default:
      return oldValue;
  }
};

const getNewValue = (data, oldValue, method, status) => {
  switch (status) {
    case statuses.attempt:
      return {
        data: oldValue,
        pending: true,
        error: undefined,
      };
    case statuses.failure:
      return {
        data: oldValue,
        pending: false,
        error: data,
      };
    case statuses.success:
      return {
        data: getSuccess(data, oldValue, method),
        pending: false,
        error: undefined,
      };
    default:
      break;
  }
};

const reducer = (state = {}, action) => {
  if (!action.type.includes(identifier)) return state;

  const id = action.id
  const values = action.type.replace(identifier, "").split("_");
  const method = values[0];
  const resourceName = values
    .slice(1, values.length - 1)
    .join("_")
    .toLowerCase();
  const status = `_${values[values.length - 1]}`;

  const data = (method === 'DELETE' && typeof action.response === 'string') ? { id } : action.response;
  const oldValue = (state[resourceName] || {}).data || [];

  const newValue = getNewValue(data, oldValue, method, status);

  return {
    ...state,
    [resourceName]: newValue,
  };
};

export default reducer;
