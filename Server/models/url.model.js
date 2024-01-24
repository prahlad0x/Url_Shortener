const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const urlSchema = new Schema({
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, unique: true, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  time:{type:Date , default:Date.now()}
});

const Url = mongoose.model('Url', urlSchema);

module.exports = {Url};
