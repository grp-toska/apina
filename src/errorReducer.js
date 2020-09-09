import { statuses, identifier } from "./values";

const reducer = (state = [], action) => {
  if (!action.type.includes(identifier)) return state;
  const values = action.type.replace(identifier, "").split("_");
  const method = values[0];
  const resourceName = values
    .slice(1, values.length - 1)
    .join("_")
    .toLowerCase();
  const status = `_${values[values.length - 1]}`;
  if (status !== statuses.failure) return state

  const error = action.response;

  return [
    ...state,
    {
      error,
      method,
      resource: resourceName,
      timestamp: new Date()
    }
  ];
};

export default reducer;
