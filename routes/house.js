const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {House}=require('../models/Houses')

router.get('/house',auth,async(req,res)=>{               
    try{
        const house = await House.find({author:req.user.id})
        if(house.length === 0){
            return res.status(404).json({message:"Sizda xech qanday elon yo`q"})
        }
        console.log(house)
        res.status(200).send(house)
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:"Xatolik yuz berdi"})
    }
   
})

module.exports = router;