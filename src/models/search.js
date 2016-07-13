// Search Model
// ------------

var mongoose = require('mongoose');

var SearchSchema = new mongoose.Schema({
  query: String, // Probably an array, since we will be adding additional Strings!
  userId: String,
  found: Boolean
}, {
  strict: false
});

module.exports = mongoose.model('Search', SearchSchema);
