const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const { v4: uuidv4 } = require('uuid');


const User = new Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }, 
  lastSessionId : {
    type: String,
    default: false
  }
  },{
    strict: false
  },
);

module.exports = Mongoose.model('UserDetails', User);