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
        // console.log(house)
        res.status(200).send(house)
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:"Something wrong, please tyr again"})
    }
   
})
router.delete('/house',auth,async(req,res)=>{
    try{
        const id = req.body.id;
        const house = await House.findById(id)
        if(!house)return res.status(404).send({message:"House not found."})
        await House.findByIdAndDelete(id)
        res.status(200).send({message:"House successfully deleted."})
        console.log(house)
    }
    catch(err){
        res.status(500).send({message:"An error occurred while deleting the house."})
    }
})

module.exports = router;