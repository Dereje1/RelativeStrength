// get mt4 currency data from EC2 instance (saved every 15 mins)
const axios = require('axios');
const calendar = require('./calendar'); // gets ff calendar

const getLastPrices = (arr) => {
  const priceObject = {};
  arr.forEach((line) => {
    const x = (line.split('\t'))[0];
    if (Number(x)) {
      const symbol = line.split('\t')[1];
      const price = line.split('\t')[8];
      priceObject[symbol] = Number(price);
    }
  });
  return priceObject;
};

const toJSON = (data) => { // converts Rstrength mt4 data into json
  const allstrength = data.split('Relative Strength against USD');
  // get updated property
  const obj = { updated: allstrength[0].split('Performance Range')[0].split('Generated')[1].trim() };
  // disregard everything above rstrength and parse each line below
  allstrength.slice(1).forEach((r, idx) => {
    const frame = (r.split('\n').slice(1, 9)); // each time frame
    let frameDesc;
    if (idx === 1) {
      frameDesc = 'Past 24 Hours';
    } else if (idx === 0) {
      frameDesc = 'Past 10 Days';
    } else {
      frameDesc = 'Past Year';
    }

    // collect into array each currencies result , disregard Mt4 calendar / not reliable
    const frameCollection = [];
    frame.forEach((currency) => {
      const cInfo = currency.split('\t');
      // cInfo = cInfo[2]==="\r" ? [cInfo[0],cInfo[1]] : cInfo
      frameCollection.push([cInfo[0], cInfo[1]]);
    });
    // collect all info into obj
    obj[frameDesc] = frameCollection;
    obj.lastPrices = getLastPrices(data.split('\n').slice(3, 34));
  });
  return obj;
};

module.exports = () =>
  new Promise((resolve, reject) => {
    axios.get(process.env.AWS_RAW_DATA)// data comes in as a pure text file
      .then((response) => {
        calendar()
          .then((c) => { // once aws data comes in get ff calendar
          // combine both sets into json after converting mt4 text file and send
            resolve(Object.assign({}, toJSON(response.data), c));
          })
          .catch(() => {
            console.log('Error Fetching Calendar!!!!');
            resolve(Object.assign({}, toJSON(response.data), { weeklyevents: [] }));
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
