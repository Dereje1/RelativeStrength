// get forex faxtory calendar events for the week
const axios = require('axios');
const parser = require('xml2js'); // parses ff xml to json

module.exports = () =>
  new Promise((resolve, reject) => {
    axios.get('https://cdn-nfs.forexfactory.net/ff_calendar_thisweek.xml')
      .then((response) => {
        parser.parseString(response.data, (err, result) => {
          resolve(result);
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
