// Employee Model
var mongoose = require('mongoose');

var EmployeeSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  skills: String,
  portfolio: String
});

module.exports = mongoose.model('Employee', EmployeeSchema);
