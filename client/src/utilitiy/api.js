import axios from 'axios';

/*
Api coomands
*/
export const postNewTrade = entry =>
  axios.post('/api/newtrade', entry)
    .then(response => response.data)
    .catch(error => error);

export const getOpenTrades = () =>
  axios.get('/api/getopentrades')
    .then(response => response.data)
    .catch(error => error);

export const getClosedTrades = (minDate, limited = false) => {
  // limited displays specified amount or max of 500 trades.
  const queryURL = limited ?
    `/api/getclosedtrades/${limited}?start=${minDate}`
    :
    `/api/getclosedtrades/500?start=${minDate}`;
  return axios.get(queryURL)
    .then(response => response.data)
    .catch(error => error);
};


export const setStop = newStop =>
  axios.put('/api/movestop', newStop)
    .then(response => response.data)
    .catch(error => error);

export const closeTrade = exitInfo =>
  axios.put('/api/closetrade', exitInfo)
    .then(response => response.data)
    .catch(error => error);

export const addTrade = updatedInfo =>
  axios.put('/api/addtrade', updatedInfo)
    .then(response => response.data)
    .catch(error => error);

