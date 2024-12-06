// const express = require('express');
// const router = express.Router();
// const Joi = require('joi');
// const sendEmail = require('../OtherFiles/emailSender');

// // Email ma'lumotlarini tekshirish uchun validator
// const EmailValidater = Joi.object({
//     name: Joi.string().min(3).required(),
//     lastname: Joi.string().allow(''),
//     email: Joi.string().email().required(),
//     message: Joi.string().min(3).required(),
// });

// // POST so'rovni yuborish
// router.post('/emailSender', async (req, res) => {
//     const data = req.body; // Mijozdan kelgan ma'lumotlar
//     const { isValidate } = EmailValidater.validate(data); // Validationni tekshirish
//     if (isValidate) {
//         return res.status(400).json({
//             success: false,
//             message: 'Validation error',
//             details: isValidate.details.map((err) => err.message), 
//         });
//     }

//     try {
//         // sendEmail funksiyasiga ma'lumotlarni uzatish
//         await sendEmail(isValidate); // Ma'lumotni uzatish
//         res.status(200).json({
//             success: true,
//             message: 'Your message has been successfully sent!',
//         });
//     } catch (err) {
//         console.error('Xatolik:', err.stack || err); // Batafsil xatolik ma'lumotlarini chiqarish
//         res.status(500).json({
//             success: false,
//             message: 'Failed to send email. Please try again later.',
//             error: err.message, // Xatolikni foydalanuvchiga ko‘rsatish
//         });
//     }
// });

// module.exports = router;
