"use strict" //get mt4 currency data from EC2 instance (saved every 15 mins)
var axios = require('axios')
var calendar = require('./calendar')//gets ff calendar

module.exports =  function(){
  return new Promise((resolve,reject)=>{
    axios.get(process.env.AWS_RAW_DATA)//data comes in as a pure text file
    .then((response)=>{
      calendar().then((c)=>{//once aws data comes in get ff calendar
        //combine both sets into json after converting mt4 text file and send
        resolve(Object.assign({}, toJSON(response.data), c))
      })
    })
    .catch((err)=>{
      reject(err)
    })
  })
}

function toJSON(data){//converts Rstrength mt4 data into json
  let allstrength = data.split("Relative Strength against USD")
  //get updated property
  let obj={"updated":allstrength[0].split("Performance Range")[0].split("Generated")[1].trim()}
  //disregard everything above rstrength and parse each line below
  allstrength.slice(1).forEach((r,idx)=>{
    let frame = (r.split("\n").slice(1,9)) // each time frame
    let frameDesc
    if(idx===1){
      frameDesc = "Past 24 Hours"
    }
    else if (idx===0){
      frameDesc = "Past 10 Days"
    }
    else{
      frameDesc = "Past Year"
    }

    let frameCollection=[]//collect into array each currencies result , disregard Mt4 calendar / not reliable
    frame.forEach((currency)=>{
      let cInfo = currency.split("\t")
      //cInfo = cInfo[2]==="\r" ? [cInfo[0],cInfo[1]] : cInfo
      frameCollection.push([cInfo[0],cInfo[1]])
    })
    //collect all info into obj
    obj[frameDesc]=frameCollection
  })
  return obj
}
