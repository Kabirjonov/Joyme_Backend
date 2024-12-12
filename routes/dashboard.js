const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { houseValidation, House } = require('../models/Houses')
const upload = require('../middleware/image')

router.post('/dashboard', auth, upload.single('file'), async (req, res) => {
    try {
        const { price, viloyat, shaxar, tuman, type, tur, area, coordinates, comment, } = req.body;
        const newHouse = ({
            fileName: req.file.filename,
            price,
            viloyat,
            shaxar,
            tuman,
            type,
            tur,
            area,
            coordinates: JSON.parse(coordinates),
            comment,
            author: req.user.id,    
            // authorInfo:{}
        
        });
        const { error } = houseValidation(newHouse)
        if (error) {
            console.error(error)
            return res.status(400).json({ message: error.details[0].message });
        }


        const data = new House(newHouse)
        await data.save();
        res.status(201).send({ message: 'Seccessfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server xatosi', error: err.message });
        console.log(err)
    }
})


module.exports = router;