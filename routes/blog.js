const express = require('express')
const router = express.Router()
const { House } = require('../models/Houses')

router.get('/blog/:page', async (req, res) => {
    try {
        const page = parseInt(req.params.page) || 1
        const limit = 9
        const skip = (page - 1) * limit
        const houses = await House.find().skip(skip).limit(limit)
        const totalCount = await House.countDocuments()
        const totalPage = Math.ceil(totalCount / limit)
        res.status(200).send({ houses, totalPage })
    } catch (err) {
        res.status(400).send(err.message)
    }
})
router.get('/search/:page', async (req, res) => {
    try {
        const page = parseInt(req.params.page)|| 1;
        const limit = 9;
        const skip = (page-1)*limit;

        const { location, type, price } = req.query; 
        console.log(location,type,price)
        let query={
            $or:[
                {
                    $or:[
                        // { viloyat: { $regex: location, $options: 'i' }},
                        // { tuman: { $regex: location, $options: 'i' }},
                        // { shaxar: { $regex: location, $options: 'i' }},
                        {viloyat:location},
                        {tuman:location},
                        {shaxar:location},
                    ]
                },
                {price:{$lte:price}},
                // { type: { $regex: type, $options: 'i' } } 
                {type:type}
            ]
        }

        const houses = await House.find(query).skip(skip).limit(limit);
  
        if(houses.length==0){
            return res.status(404).json({message:"Malumot topilmadi"})
        }
        const totalCount = await House.countDocuments(query)
        const totalPage = Math.ceil(totalCount / limit)
        res.status(200).send({houses,totalPage})
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
})

module.exports = router;