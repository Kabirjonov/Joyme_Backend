const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { uploadSingle, uploadMultiple } = require('../middleware/image');
const createImageUrl = require('../middleware/fileUrl');
const { houseValidation, House } = require('../models/Houses');

// Multiple file upload route
router.post('/dashboard', auth, uploadMultiple, createImageUrl, async (req, res) => {
    try {
        const { price, viloyat, shaxar, tuman, type, tur, area, coordinates, comment } = req.body;
        
        const fileUrls = req.files.map(file => req.ImgUrl + file.filename);

        const newHouse = {
            fileNames: req.files.map(file => file.filename),
            fileUrls,
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
        };

        const { error } = houseValidation(newHouse);
        if (error) {
            console.error(error);
            return res.status(400).json({ message: error.details[0].message });
        }

        const data = new House(newHouse);
        await data.save();
        res.status(201).send({ message: 'Successfully added' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
        console.error(err);
    }
});

module.exports = router;
