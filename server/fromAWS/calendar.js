// get forex faxtory calendar events for the week
const axios = require('axios');

module.exports = () =>
  new Promise((resolve, reject) => {
    axios.get('https://cdn-nfs.faireconomy.media/ff_calendar_thisweek.json')
      .then((response) => {
        resolve({ weeklyevents: response.data });
      })
      .catch((err) => {
        reject(err);
      });
  });
