const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { houseValidation, House } = require('../models/Houses')
const upload = require('../middleware/image')

router.post('/dashboard',upload.single('file'), auth, async (req, res) => {
    // const { error } = houseValidation(req.body);
    // if (error) {
    //     return res.status(400).json({ message: error.details[0].message });
    // }
    // let { coordinates } = req.body;
    // if (coordinates) {
        // Koordinatalarni JSON stringdan arrayga aylantiramiz
        // coordinates = JSON.parse(coordinates);  // JSON stringni arrayga aylantiradi
    // }
    // const { file,price,viloyat,shaxar,tuman,type,tur,area,coordinates,comment} = req.body;
    const data = req.body;
    console.log(data)
    try {
    //     const newHouse = new House({
    //         fileName,
    //         price,
    //         viloyat,
    //         shaxar,
    //         tuman,
    //         type,
    //         tur,
    //         area,
    //         coordinates,
    //         comment,
    //         author:req.user.id,
    //     });
    //     await newHouse.save();
        res.status(201).send({message:'Seccessfully'});
    } catch (err) {
        res.status(500).json({ message: 'Server xatosi', error: err.message });
        console.log(err.message)
    }
})


module.exports = router;