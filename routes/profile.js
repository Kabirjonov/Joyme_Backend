const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/image')
const { User } = require('../models/Authorization');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// uploads papkasini yaratishni tekshirish


router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        if (!user) return res.status(404).send({ message: "User not found!" })
        res.status(200).send(user)
    } catch (err) {
        res.status(500).send({ message: "Server error", error: err.message })
    }
})
router.put('/profile', upload.single('file'), auth, async (req, res) => {
    try {
        const { firstName, lastName, email, phone, birthday, gender, bio } = req.body;
        console.log('Req body:',req.body)

        // Yangilanish uchun yangi obyektni tayyorlash
        const updatedProfile = {
            firstName,
            lastName,
            email,
            phone,
            birthday,
            gender,
            bio,
        };
        // Agar fayl yuklangan bo‘lsa, rasm yo‘lini qo‘shamiz
        if (req.file) {
            updatedProfile.fileName = req.file.filename;
            console.log("Special Profile put method",req.file.filename)
            updatedProfile.fileUrl = `http://localhost:3001/uploads/${req.file.filename}` //req.file.path
        }
        // Ma'lumotlar bazasida yangilash
        const UploadUser = await User.findByIdAndUpdate(req.user.id, updatedProfile, { new: true });
        if (!UploadUser) return res.status(404).send({ message: 'Foydalanuvchi topilmadi' });

        res.status(200).send({ message: 'Profil muvaffaqiyatli yangilandi', UploadUser: UploadUser, });
        console.log('Update User:',UploadUser)
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Profilni yangilashda xatolik', error: err.message });
    }
});
router.delete('/profile',auth,async(req,res)=>{
    try{
        const user = await User.findOneAndDelete(req.user.id)
        if(!user)return res.status(404).send({message:"User not found!"})
        res.status(200).send('user')
    }catch(err){
        res.status(500).send({ message: "Server error", error: err.message })
    }
})

router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        res.status(400).json({ message: 'Yuklash xatoligi', error: err.message });
    } else if (err) {
        res.status(500).json({ message: 'Server xatoligi', error: err.message });
    } else {
        next();
    }
});

module.exports = router;
