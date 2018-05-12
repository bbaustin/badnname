// Employee Model
var mongoose = require('mongoose');

var PostingSchema = new mongoose.Schema({
  titleName: String,
  postContent: String,
  author: String,
  userId: String,
  time: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Posting', PostingSchema);
