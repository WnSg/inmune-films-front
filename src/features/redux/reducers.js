import { combineReducers } from 'redux';
import someReducer from './someReducer';

const rootReducer = combineReducers({
  someReducer,
  // otros reducers aquí
});

export default rootReducer;
