// only getuser action dispatches to store
import axios from 'axios';

const getUser = () =>
  // action gets user authentication status from /profile that is generated
  // and updates store
  (dispatch) => {
    axios.get('/auth/profile')
      .then((response) => {
        dispatch({
          type: 'GET_USER_STATUS',
          payload: response.data,
        });
      })
      .catch((err) => {
        dispatch({
          type: 'GET_USER_STATUS_REJECTED',
          payload: err,
        });
      });
  };

export default getUser;
