import React, { useState, useEffect } from 'react';
import CelebrationtypesForm from 'pages/CRUD/Celebrationtypes/form/CelebrationtypesForm';
import { push } from 'connected-react-router';
import actions from 'actions/celebrationtypes/celebrationtypesFormActions';
import { connect } from 'react-redux';

const CelebrationtypesFormPage = (props) => {
  const { dispatch, match, saveLoading, findLoading, record, currentUser } =
    props;

  const [dispatched, setDispatched] = useState(false);

  const isEditing = () => {
    return !!match.params.id;
  };

  const isProfile = () => {
    return match.url === '/app/profile';
  };

  const doSubmit = (id, data) => {
    if (isEditing() || isProfile()) {
      dispatch(actions.doUpdate(id, data, isProfile()));
    } else {
      dispatch(actions.doCreate(data));
    }
  };

  useEffect(() => {
    if (isEditing()) {
      dispatch(actions.doFind(match.params.id));
    } else {
      if (isProfile()) {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const currentUserId = currentUser.user.id;
        dispatch(actions.doFind(currentUserId));
      } else {
        dispatch(actions.doNew());
      }
    }
    setDispatched(true);
  }, [match, dispatch]);

  return (
    <React.Fragment>
      {dispatched && (
        <CelebrationtypesForm
          saveLoading={saveLoading}
          findLoading={findLoading}
          currentUser={currentUser}
          record={isEditing() || isProfile() ? record : {}}
          isEditing={isEditing()}
          isProfile={isProfile()}
          onSubmit={doSubmit}
          onCancel={() => dispatch(push('/admin/celebrationtypes'))}
        />
      )}
    </React.Fragment>
  );
};

function mapStateToProps(store) {
  return {
    findLoading: store.celebrationtypes.form.findLoading,
    saveLoading: store.celebrationtypes.form.saveLoading,
    record: store.celebrationtypes.form.record,
    currentUser: store.auth.currentUser,
  };
}

export default connect(mapStateToProps)(CelebrationtypesFormPage);
