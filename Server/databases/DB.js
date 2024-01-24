const mongoose = require('mongoose');
require('dotenv').config()

const dataBaseConnection = mongoose.connect(process.env.mongoUrl)


module.exports = {dataBaseConnection}