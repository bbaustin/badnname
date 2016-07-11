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
    res.render('search');
  })
  .post(function(req, res) {
    Search.create({
      query: req.body.query
    })
///////////  BANDCAMP SCRAPER  ////////////
    bandcamp.search({
      query: req.body.query,
      page: 1
      }, function(error, results) {
        if (error) {
          console.log(error);
        } 

    /////////  TYPE: ALBUM  /////////    
        else if (results[0].type === 'album') {
          if (req.body.query.toLowerCase() === results[0].artist.toLowerCase()) {
            console.log(results);
            res.render('searchResult', {
              query: req.body.query,
              link: results[0].link, // [0] is band info
              image: results[0].image // [1] is album info? maybe 
            })
          }
        else {
          console.log(results);
          console.log(results[0].name);
          console.log(req.body.query);
          res.render('searchResult', {
            query: req.body.query + " but maybe that band name is still available"
          })
        }
      }
    /////////  TYPE: ARTIST  /////////    
        // else if(results[0].type === 'artist') {
        //   if (req.body.query.toLowerCase() === results[0].name.toLowerCase()) {
        else if (results[0].type === 'artist') {

          if (req.body.query.toLowerCase() === results[0].name.toLowerCase()) {
            console.log(results);
            res.render('searchResult', {
              query: req.body.query,
              link: results[0].link, // [0] is band info
              image: results[0].image // [1] is album info? maybe 
            })
          }
          else {
            console.log(results);
            console.log(results[0].name);
            console.log(req.body.query);
            res.render('searchResult', {
            query: req.body.query + " but maybe that band name is still available"
          })
        }
      }


    });
  });



    //  (req.body.query.toLowerCase() === results[0].name.toLowerCase())//|| req.body.query.toLowerCase() === results[0].artist.toLowerCase()) {
    //   //console.log(results);
    //   //res.json(results);
    //   {
    //   console.log(results);
    //   res.render('searchResult', {
    //     query: req.body.query,
    //     link: results[0].link, // [0] is band info
    //     image: results[0].image // [1] is album info? maybe 
    //   })
    // }
    // else {
    //   console.log(results);
    //   console.log(results[0].name);
    //   console.log(req.body.query);
    //   res.render('searchResult', {
    //     query: req.body.query + " but maybe that band name is still available"
    //   })
    // }



module.exports = SearchController;
