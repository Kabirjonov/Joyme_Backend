const express = require('express');
const router = express.Router();
const { User } = require('../models/Authorization')
const { House } = require('../models/Houses')
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().limit(9).select('-password')// bu yerda eng activeni sotuvchilarni sortlash kerak uning uchun
        res.status(200).send(users)
    } catch (err) {
        res.status(500).send({ message: "Server error", error: err.message })
        console.log(err)
    }
})
router.get('/info/:id', async (req, res) => {
    try {
        const id = req.params.id
        const house = await House.findById(id)
        if (!house) {
            const user = await User.findById(id)
            return res.status(200).send(user)
        }
        res.status(200).send(house)
    } catch (err) {
        res.status(500).send({ message: "Server error", error: err.message })
        console.log(err)
    }

});

module.exports = router;
