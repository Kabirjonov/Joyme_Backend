const express = require('express');
const router = express.Router();

const { User } = require('../models/Authorization');
const {House} = require('../models/Houses')


const path = require('path');
const fs = require('fs');
const multer = require('multer');
const fileUrl = require('../middleware/fileUrl');

// middlewares
const auth = require('../middleware/auth');
const {uploadSingle} = require('../middleware/image')
const createImageUrl =require('../middleware/fileUrl')
const delImg = require('../middleware/deleteImg')

router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        if (!user) return res.status(404).send({ message: "User not found!" })
        res.status(200).send(user)
        console.log('Userga get methodi bilan qaytarilyotgan malumot',user)
    } catch (err) {
        res.status(500).send({ message: "Server error", error: err.message })
    }
})
router.put('/profile', uploadSingle, auth,createImageUrl, async (req, res) => {
    try {
        const { firstName, lastName, email, phone, birthday, gender, bio } = req.body;
        const user = await User.findById(req.user.id)
        if (!user) return res.status(404).send({ message: 'Foydalanuvchi topilmadi' });
        let fileUrl,fileName;
        if(req.file){
            fileUrl=req.ImgUrl;
            fileName=req.file.filename
            // delImg(user.fileName)
        }else{
            fileUrl = user.fileUrl
            fileName = user.fileName
        }
        const updatedProfile = {
            firstName: firstName || user.firstName,
            lastName: lastName || user.lastName,
            email: email || user.email,
            phone: phone || user.phone,
            birthday: birthday || user.birthday,
            gender: gender || user.gender,
            bio: bio || user.bio,
            fileName,
            fileUrl,
        };
        const UploadUser = await User.findByIdAndUpdate(req.user.id, updatedProfile, { new: true });
        res.status(200).send({ message: 'Profil muvaffaqiyatli yangilandi', UploadUser: UploadUser, });
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: 'Profilni yangilashda xatolik', error: err.message });
    }
});
router.delete('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).send({ message: "User not found!" });
        const house = await House.find({author:req.user.id})
        console.log(house)
        if(house.length!=0)return res.status(422).json({message:"Iltimos account o`chirishdan oldin qo`shilgan e`lonlarni o`chiring!"})
        else{
            if (user.fileName) delImg(user.fileName);
            await User.findByIdAndDelete(req.user.id);
            res.status(204).json({ message: "Your account has been deleted successfully." });
        }
    } catch (err) {
        console.error("Error deleting user:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

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