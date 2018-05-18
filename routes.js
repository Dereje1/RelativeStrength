"use strict"
const router = require('express').Router();
const raw = require('./fromAWS/raw')
var User = require('./models/user');

const verification = (req,res,next) =>{
    const requestingUserID = req.query.googleid
    const passportSessionUserId = Object.keys(req.session.passport).length===0 ? null : req.session.passport.user
    
    if(passportSessionUserId){
        User.findById(passportSessionUserId,(err,user)=>{
            if(err){
                throw err
            }
            if(requestingUserID===user.google.id){
                return next()
            }
            else{
                res.end("Authentication can not be Verified!!")
            }
        })
    }
    else{
        res.end("Not Authenticated!!")
    }
    
}
router.get("/api/test",verification,(req,res)=>{//test session 
    res.json(req.session)
  })
  
router.get("/api/getraw",function(req,res){//raw data access route
    raw().then((response)=>{
        res.json(response)
    })
    .catch((err)=>{
        res.end(err)
    })
})

module.exports=router

