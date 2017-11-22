var axios = require('axios')
var parseString = require('xml2js').parseString;
module.exports =  function(){
  return new Promise((resolve,reject)=>{
    axios.get("https://cdn-nfs.forexfactory.net/ff_calendar_thisweek.xml")
    .then((response)=>{
      parseString(response.data, function (err, result) {
        resolve(result)
      });

    })
    .catch((err)=>{

      reject(err)
    })
  })
}
