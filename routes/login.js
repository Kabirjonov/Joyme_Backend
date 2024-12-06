var express = require('express');
var router = express.Router();
const { LoginValidator, User } = require('../models/Authorization');
const bcrypt = require('bcrypt');


router.post('/login', async (req, res) => {
  // Validate the user input
  const { error } = LoginValidator(req.body);
  if (error) {return res.status(400).send(error.details[0].message);console.log('signIn validatsiya xatosi') }
  const { email, password } = req.body;
  try {
    // Check if the email exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("Invalid email or password");
    // Check if the password matches
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(400).send("Invalid email or password");

    // Optionally, generate a JWT or session here to authenticate the user for further requests
    // Send a success response
    // res.status(200).send({
    //   message: 'Login successful',
    //   user: {
    //     name: existingUser.name,
    //     email: existingUser.email,
    //     // Optionally, send a token if you're using JWT or session-based authentication
    //   }
    // });
    const token = user.generateAuthToken()
    // console.log(`User logged in successfully: ${email}`);
    res.header('x-auth-token',token).send(user)
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
