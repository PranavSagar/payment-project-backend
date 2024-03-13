const express = require('express');
const router = express();
const { registerUser,loginUser,fetchUserDetails } = require('../controllers/userController');

router.post('/signup',registerUser);

router.post('/login', loginUser);

router.get('/fetch', fetchUserDetails);



module.exports = router;