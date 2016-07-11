var mongoose = require('mongoose');

var connectionString = 'mongodb://localhost/BadnnameDB';

// We will have two collections:
  // 1) Users
  // 2) Searches
    // + Searches will be linked to Users by UserID

mongoose.connect(connectionString);

mongoose.connection.on('connected', function() {
  console.log('mongoose connected to ' + connectionString);
});

mongoose.connection.on('error', function(err) {
  console.log('mongoose connected error ' + err);
});

mongoose.connection.on('disconnected', function() {
  console.log('mongoose disconnected ') ;
});

