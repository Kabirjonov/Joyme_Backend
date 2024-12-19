var express = require('express');
var router = express.Router();
const { UserValidator, User } = require('../models/Authorization');
const bcrypt = require('bcrypt');
const _ = require('lodash')

router.post('/logup', async (req, res) => {
  // Validate the user input
  // const { firstName, lastName, email, phone, password, birthday, gender,isAdmin } = req.body;
  const { firstName, lastName, email, phone, password, birthday, gender } = req.body;
  console.log(firstName,lastName, email, phone, password, birthday, gender)

  const { error } = UserValidator(req.body);
  if (error) { 
    console.log(error)
    return res.status(400).send(error.details[0].message ); 
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(208).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      phone,
      password:hashedPassword,
      birthday,
      gender,
      isAdmin:false,
    });

    // Save the new user to the database
    await newUser.save();

    // Extract necessary fields for response
    // const userResponse = _.pick(newUser, ['_id', 'firstName', 'lastName', 'password', 'email', 'phone', 'birthday']);


    // Generate JWT token
    const token = await newUser.generateAuthToken();
    // Send response with the token
    res
      .status(200)
      .header('x-auth-token', token)
      .send({
        message: 'User created successfully!',
        // user: { ...userResponse },
        // token, // Include token in the response body
      });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: 'Internal server error',
      details: err.message,
    });
  }
});

module.exports = router;
