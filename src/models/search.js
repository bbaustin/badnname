// Search Model
// ------------
var mongoose = require('mongoose');

var SearchSchema = new mongoose.Schema({
  query: String,
  userId: String,
  found: Boolean
}, {
  strict: false
});

module.exports = mongoose.model('Search', SearchSchema);
