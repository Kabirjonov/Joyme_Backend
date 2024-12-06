const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { User } = require('../models/Authorization');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// uploads papkasini yaratishni tekshirish




// Foydalanuvchi profili (GET so'rovi)
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Foydalanuvchi profili (PUT so'rovi)
// uploads papkasini yaratishni tekshirish
const ensureUploadsFolder = () => {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};
ensureUploadsFolder();

// Multer sozlamalari (fayllarni xotirada saqlash)
const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Maksimal hajm: 5 MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const isValidType = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const isValidMime = allowedTypes.test(file.mimetype);

        if (isValidType && isValidMime) {
            cb(null, true);
        } else {
            cb(new Error('Only JPEG, JPG, and PNG files are allowed!'));
        }
    },
});

// Foydalanuvchi profili (PUT so'rovi)
router.put('/profile', auth, upload.single('profileImage'), async (req, res) => {
    try {
        const { firstName, lastName, phone, birthday, gender, bio } = req.body;
        const user = await User.findById(req.user.id);

        if (req.file) {
            // Delete old profile image if exists
            if (user.profileImage) {
                const oldImagePath = path.join(__dirname, '../uploads', user.profileImage);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);  // Delete old file
                }
            }

            // Profil rasmini saqlash uchun to'g'ri yo'lni belgilash
            const profileImage = `uploads/${Date.now()}_${req.file.originalname}`;
            const filePath = path.join(__dirname, '../uploads', profileImage); // uploads papkasida faylni saqlash
            await sharp(req.file.buffer)
                .resize(250, 250)
                .toFile(filePath); // Faylni shu yo'lga saqlash

            user.profileImage = `/${profileImage}`; // To'g'ri URL qaytariladi
        }

        user.firstName = firstName;
        user.lastName = lastName;
        user.phone = phone;
        user.birthday = new Date(birthday);
        user.gender = gender;
        user.bio = bio;

        await user.save();
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});
module.exports = router;
