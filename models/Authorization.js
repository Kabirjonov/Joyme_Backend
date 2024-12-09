const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const config = require('config')

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    birthday: { type: Date, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    gender: { type: String, required: true, enum: ['man', 'woman'] },
    bio:{type:String},

    fileName:{type:String,},
    fileUrl:{type:String,},
});


UserSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { id: this._id, username: this.firstName },
        config.get('jwtPrivateKey'), // Maxfiy kalitni config fayldan olamiz
        // { expiresIn: '1h' } // Tokenning amal qilish muddati (masalan, 1 soat)
    );
    return token;
};
// UserValidator function using Joi for validation
const UserValidator = (user) => {
    const validate = Joi.object({
        firstName: Joi.string().required().min(3).max(50),
        lastName: Joi.string().required().min(3).max(50),
        email: Joi.string().email().required(),
        phone: Joi.string().required(),
        birthday: Joi.date().required(),
        password: Joi.string().required().min(6).max(255),
        gender: Joi.string().valid('man', 'woman').required(),
        bio:Joi.string().optional(),

        fileName:Joi.string().optional(),
        fileUrl:Joi.string().optional(),
    });
    return validate.validate(user);
};
const LoginValidator = (user) => {
    const validate = Joi.object({
        email: Joi.string().email().required(), // Corrected Joi.string().email()
        password: Joi.string().required().min(6).max(255),
    });
    return validate.validate(user); // Perform validation
};

const User = mongoose.model('User', UserSchema);
exports.User = User;
exports.LoginValidator = LoginValidator;
exports.UserValidator = UserValidator;