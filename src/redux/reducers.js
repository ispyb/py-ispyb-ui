import { combineReducers } from "redux";
import site from "./reducers/site";
import user from "./reducers/user";

export default combineReducers({
  user,
  site,
});
