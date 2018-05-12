// Boss Model
var mongoose = require('mongoose');

var BossSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  boss: {type: Boolean, default: false},
  bio: String,
  picture: Buffer,
  skills: String,
  portfolio: String,
  posts: Array,
  time: {type: Date, default: Date.now}
  });

module.exports = mongoose.model('Boss', BossSchema);



