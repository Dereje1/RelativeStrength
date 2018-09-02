// unifies all reducers
import { combineReducers } from 'redux';

// HERE IMPORT REDUCERS TO BE COMBINED
import userStatusReducer from './userreducer';
import forexDataReducer from './forexReducer';

// HERE COMBINE THE REDUCERS
export default combineReducers({
  user: userStatusReducer,
  forexData: forexDataReducer,
});
