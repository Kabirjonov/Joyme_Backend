const mongoose = require('mongoose');

const houseSchema = new mongoose.Schema({
    fileName: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    viloyat: { type: String, required: true, trim: true },
    tuman: { type: String, required: true, trim: true },
    shaxar: { type: String, required: true, trim: true },
    type: { type: String, enum: ['sell', 'rent'],lowercase: true, required: true },
    tur: { type: String, enum: ['house', 'apartment'], lowercase: true,required: true },
    coordinates: {
        type: [Number],
        required: true,
        validate: {
            validator: function(v) {
                return v.length === 2;
            },
            message: "Koordinatalar faqat longitude va latitude bo'lishi kerak!"
        }
    },
    area: { type: Number, required: true, min: 1 },
    comment: { type: String, trim: true, maxlength: 500 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true
});

// Geolokatsiya uchun indeksi
houseSchema.index({ coordinates: '2dsphere' });


const Joi = require('joi');
// Uy sotish uchun validatsiya sxemasi
const houseValidation = (house)=>{
const validate = Joi.object({
    fileName: Joi.string().required().messages({
        'string.empty': 'Fayl manzili majburiy!',
        'string.uri': 'Fayl URL bo‘lishi kerak!'
    }),
    price: Joi.number().min(0).required().messages({
        'number.base': 'Narx raqam bo‘lishi kerak!',
        'number.min': 'Narx 0 dan kam bo‘lmasligi kerak!',
        'any.required': 'Narx majburiy!'
    }),
    viloyat: Joi.string().required().messages({
        'string.empty': 'Viloyat majburiy!'
    }),
    tuman: Joi.string().required().messages({
        'string.empty': 'Tuman majburiy!'
    }),
    shaxar: Joi.string().required().messages({
        'string.empty': 'Shahar majburiy!'
    }),
    type: Joi.string().valid('sell', 'rent').insensitive().required().messages({
        'any.only': 'Tur faqat "Sell" yoki "Rent" bo‘lishi kerak!',
        'any.required': 'Tur majburiy!'
    }),
    tur: Joi.string().valid('house', 'apartment', ).required().messages({
        'any.only': 'Uy turi noto‘g‘ri!',
        'any.required': 'Uy turi majburiy!'
    }),
    coordinates: Joi.array()
        .items(Joi.number().required())
        .length(2)
        .required()
        .messages({
            'array.length': 'Koordinatalar faqat 2 ta qiymatdan iborat bo‘lishi kerak!',
            'array.includesRequiredUnknowns': 'Koordinatalar raqam bo‘lishi kerak!',
            'any.required': 'Koordinatalar majburiy!'
        }),
    area: Joi.number().min(1).required().messages({
        'number.base': 'Maydon raqam bo‘lishi kerak!',
        'number.min': 'Maydon 1 kv.m dan kam bo‘lmasligi kerak!',
        'any.required': 'Maydon majburiy!'
    }),
    comment: Joi.string().max(500).allow('').messages({
        'string.max': 'Izoh 500 belgidan oshmasligi kerak!'
    }),
    author: Joi.string().required().messages({
        'string.empty': 'Muallif ID majburiy!'
    })
});
    return validate.validate(house);
}

const House = mongoose.model('House', houseSchema);


exports.houseValidation = houseValidation;
exports.House = House;
