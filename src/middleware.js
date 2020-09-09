import axios from "axios";
import { statuses, identifier } from "./values";

 // TODO better merge
const callApi = async (argsForAxios, defaultValuesForAxios) => axios({
    ...defaultValuesForAxios,
    ...argsForAxios,
    headers: { ...defaultValuesForAxios.headers, ...argsForAxios.headers },
  });

const reduxMiddleware = (defaultValuesForAxios) => ({ dispatch }) => (next) => async (action) => {
  next(action);
  const { requestSettings, type } = action;
  if (requestSettings && type.includes(identifier + statuses.attempt)) {
    const prefix = type.replace(statuses.attempt, "");
    try {
      const res = await callApi(requestSettings, defaultValuesForAxios);
      dispatch({
        ...action,
        type: prefix + statuses.success,
        response: res.data,
      });
      return res.data
    } catch (err) {
      dispatch({
        ...action,
        type: prefix + statuses.failure,
        response: err,
      });
      return err
    }
  }
};

export default reduxMiddleware;
