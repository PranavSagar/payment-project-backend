const User = require('../models/User');
const bcrypt = require('bcrypt');
require('dotenv').config();
const Joi = require('joi');
const { checkEmailExists } = require('../utils/emailCheck');
const jwt = require('jsonwebtoken');
const crpto = require('crypto');
const secret_key = crpto.randomBytes(64).toString('hex');


const registerUser = async (req, res) => {
  const isValid = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }).validate(req.body); 

  if(isValid.error){
    return res.status(400).send({
      status: 400,
      message: 'isValid',
      data :isValid.error
    }).json({error: isValid.error.details[0].message});
  }

  const {firstName, lastName, email, password} = req.body;

  const isEmailExists =await checkEmailExists(email);
  if(isEmailExists){
    return res.status(400).send({
      status: 400,
      message: 'Email already exists'
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).send({
      status: 201,
      message: 'User created successfully',
      data: savedUser
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: 'Error creating user',
      data: error
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const isEmailExists =await checkEmailExists(email);
  if(!isEmailExists){
    return res.status(400).send({
      status: 400,
      message: 'Email does not exist'
    });
  }else{
    const userData = await User.findOne({ email})
    const isPassSame = await bcrypt.compare(password,userData.password);
    if(isPassSame){
      const payload = {
        email: userData.email, 
        id: userData._id
      }
      const token = jwt.sign( payload, secret_key, {expiresIn: '1h'});
      await User.findOneAndUpdate({email:email},{lastSessionId: token})
      return res.status(200).send({
        status: 200,
        message: 'Login successful',
        jwt: token
      });
    }else{
      return res.status(400).send({
        status: 400,
        message: 'Password is incorrect'
      });
    }
  }
};


const fetchUserDetails = async (req, res) => {
  const id = req.query.id;
  findUser = await User.findOne( {_id: id});
  if(findUser){
    return res.status(200).send({
      status: 200,
      message: 'User found',
      data: findUser.toJSON({
        transform: (doc, res) => {
          delete res.password;
          return res;
        }
      })
    });

}else{
  return res.status(400).send({
    status: 400,
    message: 'User not found'
  });
}
};
module.exports = { registerUser ,loginUser, fetchUserDetails};