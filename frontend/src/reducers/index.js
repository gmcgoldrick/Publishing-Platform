import auth from 'reducers/auth';
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import users from 'reducers/users/usersReducers';

import announcementtypes from 'reducers/announcementtypes/announcementtypesReducers';

import celebrationtypes from 'reducers/celebrationtypes/celebrationtypesReducers';

export default (history) =>
  combineReducers({
    router: connectRouter(history),
    auth,

    users,

    announcementtypes,

    celebrationtypes,
  });
