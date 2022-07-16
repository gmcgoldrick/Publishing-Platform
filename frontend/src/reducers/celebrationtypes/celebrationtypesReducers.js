import list from 'reducers/celebrationtypes/celebrationtypesListReducers';
import form from 'reducers/celebrationtypes/celebrationtypesFormReducers';
import { combineReducers } from 'redux';

export default combineReducers({
  list,
  form,
});
