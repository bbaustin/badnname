var express           = require('express'),
    SearchController  = express.Router(),
    bandcamp          = require('bandcamp-scraper'),
    Search            = require(__dirname + '/../models/search');


// SearchController.route('/:id/?') {
//   .post(function(req, res) {

//   // bandcamp.search({
//   //   query: 'Elefant Records',
//   //   page: 1
//   // } , function(error, results) {
//   //   if (error) {
//   //     console.log(error);
//   //   }    
//   //   else {
//   //   console.log(results);
//   //   }

//   // })
//   // });
// };

SearchController.route('/?') 
  .get(function(req, res) {
    res.send('hello');
  })
  .post(function(req, res) {
    bandcamp.search({
      query: 'Elefant Records',
      page: 1
  }, function(error, results) {
  if (error) {
    console.log(error);
  } else {
    console.log(results);
  }
  });
});


module.exports = SearchController;
