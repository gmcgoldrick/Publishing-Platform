import list from 'reducers/announcementtypes/announcementtypesListReducers';
import form from 'reducers/announcementtypes/announcementtypesFormReducers';
import { combineReducers } from 'redux';

export default combineReducers({
  list,
  form,
});
