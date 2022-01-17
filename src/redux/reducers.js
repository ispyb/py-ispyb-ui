import { combineReducers } from 'redux';
import site from './reducers/site';
import user from './reducers/user';
import ui from './reducers/ui';

export default combineReducers({
  user,
  site,
  ui,
});
