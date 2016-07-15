var mongoose = require('mongoose');

var connectionString = process.env.NODE_ENV === 'production' ? 'mongodb://badUser:userpw@ds021915.mlab.com:21915/badnname' : 'mongodb://localhost/users';

mongoose.connect(connectionString);

mongoose.connection.on('connected', function() {
  console.log('mongoose connected to ' + connectionString);
});

mongoose.connection.on('error', function(err) {
  console.log('mongoose connected error ' + err);
});

mongoose.connection.on('disconnected', function() {
  console.log('mongoose disconnected ');
});

