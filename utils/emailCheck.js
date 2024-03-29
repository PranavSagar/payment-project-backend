const User = require('../models/user');

const checkEmailExists = async (email) => {
  try {
    const user = await User.findOne({ email });
    return !!user;
  } catch (error) {
    console.error('Error checking email existence:', error);
    return false;
  }
};

module.exports = {checkEmailExists};
