// Search Model
// ------------

var mongoose = require('mongoose');

var SearchSchema = new mongoose.Schema({
  searchQuery: [] // Probably an array, since we will be adding additional Strings! 
}, {
  strict: false
});

module.exports = mongoose.model('Search', SearchSchema);
