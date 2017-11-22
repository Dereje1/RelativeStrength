var axios = require('axios')
var calendar = require('./calendar')

module.exports =  function(){
  return new Promise((resolve,reject)=>{
    axios.get(process.env.AWS_RAW_DATA)
    .then((response)=>{
      calendar().then((c)=>{
        resolve(Object.assign({}, toJSON(response.data), c))

      })

    })
    .catch((err)=>{

      reject(err)
    })
  })
}

function toJSON(data){
  let allstrength = data.split("Relative Strength against USD")
  let obj={"updated":allstrength[0].split("Performance Range")[0].split("Generated")[1].trim()}
  allstrength.slice(1).forEach((r,idx)=>{
    let frame = (r.split("\n").slice(1,9))
    let frameDesc
    if(idx===1){
      frameDesc = "Past 24 Hours"
    }
    else if (idx===0){
      frameDesc = "Past Week"
    }
    else{
      frameDesc = "Past Year"
    }

    let frameCollection=[]
    frame.forEach((currency)=>{
      let cInfo = currency.split("\t")
      //cInfo = cInfo[2]==="\r" ? [cInfo[0],cInfo[1]] : cInfo
      frameCollection.push([cInfo[0],cInfo[1]])
    })
    obj[frameDesc]=frameCollection
  })
  return obj
}
