import axios from 'axios';
import Errors from 'components/FormItems/error/errors';
import { push } from 'connected-react-router';
import { doInit } from 'actions/auth';
import { showSnackbar } from '../../components/Snackbar';

const actions = {
  doNew: () => {
    return {
      type: 'CELEBRATIONTYPES_FORM_RESET',
    };
  },

  doFind: (id) => async (dispatch) => {
    try {
      dispatch({
        type: 'CELEBRATIONTYPES_FORM_FIND_STARTED',
      });

      axios.get(`/celebrationtypes/${id}`).then((res) => {
        const record = res.data;

        dispatch({
          type: 'CELEBRATIONTYPES_FORM_FIND_SUCCESS',
          payload: record,
        });
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'CELEBRATIONTYPES_FORM_FIND_ERROR',
      });

      dispatch(push('/admin/celebrationtypes'));
    }
  },

  doCreate: (values) => async (dispatch) => {
    try {
      dispatch({
        type: 'CELEBRATIONTYPES_FORM_CREATE_STARTED',
      });

      axios.post('/celebrationtypes', { data: values }).then((res) => {
        dispatch({
          type: 'CELEBRATIONTYPES_FORM_CREATE_SUCCESS',
        });
        showSnackbar({ type: 'success', message: 'Celebrationtypes created' });
        dispatch(push('/admin/celebrationtypes'));
      });
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'CELEBRATIONTYPES_FORM_CREATE_ERROR',
      });
    }
  },

  doUpdate: (id, values, isProfile) => async (dispatch, getState) => {
    try {
      dispatch({
        type: 'CELEBRATIONTYPES_FORM_UPDATE_STARTED',
      });

      await axios.put(`/celebrationtypes/${id}`, { id, data: values });

      dispatch(doInit());

      dispatch({
        type: 'CELEBRATIONTYPES_FORM_UPDATE_SUCCESS',
      });

      if (isProfile) {
        showSnackbar({ type: 'success', message: 'Profile updated' });
      } else {
        showSnackbar({ type: 'success', message: 'Celebrationtypes updated' });
        dispatch(push('/admin/celebrationtypes'));
      }
    } catch (error) {
      Errors.handle(error);

      dispatch({
        type: 'CELEBRATIONTYPES_FORM_UPDATE_ERROR',
      });
    }
  },
};

export default actions;
