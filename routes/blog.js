const express = require('express')
const router = express.Router()
const {House} = require('../models/Houses')
router.get('/blog',async(req,res)=>{
    try{
        const house = await House.find().limit(9)
        res.status(200).send(house)
    }catch(err){
        res.status(400).send(err.message)
    }

})

module.exports = router;