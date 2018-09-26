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

export const getClosedTrades = () =>
  axios.get('/api/getclosedtrades')
    .then(response => response.data)
    .catch(error => error);

export const setStop = newStop =>
  axios.put('/api/movestop', newStop)
    .then(response => response.data)
    .catch(error => error);

export const closeTrade = exitInfo =>
  axios.put('/api/closetrade', exitInfo)
    .then(response => response.data)
    .catch(error => error);

