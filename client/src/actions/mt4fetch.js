// only getuser action dispatches to store
import axios from 'axios';
import { filterEvents } from '../utilitiy/fxAndMt4';

export const getForexData = () =>
  async (dispatch) => { // note async dispatch for better management on client
    await axios.get('/api/getraw')
      .then((response) => {
        dispatch({
          type: 'GET_FOREX_DATA',
          payload:
           {
             aws: response.data,
             highImpact: filterEvents(response.data.weeklyevents),
           },
        });
      })
      .catch((err) => {
        dispatch({
          type: 'GET_FOREX_DATA_REJECTED',
          payload: err,
        });
      });
  };

export const setForexData = () => (
  {
    type: 'SET_FOREX_DATA',
    payload:
    {
      aws: JSON.parse(localStorage.getItem('forexData')).aws,
      highImpact: JSON.parse(localStorage.getItem('forexData')).highImpact,
    },
  }
);
