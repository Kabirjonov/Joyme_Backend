const mongoose = require('mongoose');
const {User} = require('./Authorization')
const houseSchema = new mongoose.Schema({
    image: { type: String, required: true }, // Uy rasmi (URL yoki path)
    price: { type: Number, required: true }, // Narx
    forSell: { 
        type: String, 
        enum: ['Sell', 'Rent'], // Faqat 'Sell' yoki 'Rent' bo'lishi mumkin 
        required: true 
    },
    location: { 
        type: String, 
        required: true 
    }, // Joylashuvi (masalan, shahar, tuman)
    geolocation: { 
        type: { type: String, enum: ['Point'], required: true }, // Geolokatsiya tipi
        coordinates: { 
            type: [Number], // [longitude, latitude]
            required: true 
        }
    },
    area: { type: Number, required: true }, // Maydoni (kvadrat metrda)
    author:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // User modeliga bog'lanish
        required: true 
    }
}, {
    timestamps: true // Yaratilgan va yangilangan vaqtlar saqlansin
});

// Geolokatsiya uchun indeksi
houseSchema.index({ geolocation: '2dsphere' });

const House = mongoose.model('House', houseSchema);

module.exports = House;
