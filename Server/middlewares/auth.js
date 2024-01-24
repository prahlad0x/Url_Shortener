const jwt = require('jsonwebtoken');
const { User } = require('../models/user.model');
require("dotenv").config()

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').split(" ")[1]
    const decoded = jwt.verify(token, process.env.secret_key);
    const user = await User.findOne({ _id: decoded.userId });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed', isOk :false });
  }
};

module.exports = {auth}
