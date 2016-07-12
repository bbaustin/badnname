var express           = require('express'),
    SearchController  = express.Router(),
    bandcamp          = require('bandcamp-scraper'),
    Search            = require(__dirname + '/../models/search'),
    User              = require(__dirname + '/../models/user');



SearchController.route('/getAll')
  .get(function(req, res) {
    console.log('oooooooooooooooooooooo');
    console.log(req.session);
    Search.find({userId: req.session.userId}, function(err, searches) {
      console.log(searches.length);
      res.json(searches);
    });
  });
// list out everything matching hard-coded username 'jim' in the search collection.


// _id: req.session.userId


SearchController.route('/userHistory')
  .get(function(req, res) {
    res.render('userHistory');
  });


SearchController.route('/?') 
  .get(function(req, res) {
    res.render('search', {
      message: req.body.username
    });
  })
  .post(function(req, res) {
    console.log('xxxxxxxxxxxxxxxxxxxxxx');
    console.log(req.body.query);
    console.log(req.session.userId);
    Search.create({
      query: req.body.query,
      userId: req.session.userId
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
            //console.log(results);
            res.render('searchResult', {
              query: req.body.query,
              comment: ", but it looks like that band name might be taken.",
              link: results[0].link, // [0] is band info
              image: results[0].image // [1] is album info? maybe 
            })
          }
        else {
          //console.log(results);
          //console.log(results[0].name);
          //console.log(req.body.query);
          res.render('searchResult', {
            query: req.body.query,
            comment: ". That bandname is not registered on Bandcamp!",
            link: '/search',
            image: ''
          })
        }
      }
    /////////  TYPE: ARTIST  /////////    

        else if (results[0].type === 'artist') {

          if (req.body.query.toLowerCase() === results[0].name.toLowerCase()) {
            //console.log(results);
            res.render('searchResult', {
              query: req.body.query,
              link: results[0].link, // [0] is band info
              image: results[0].image, // [1] is album info? maybe 
              comment: ", but it looks like that band name might be taken."
            })
          }
          else {
            //console.log(results);
            //console.log(results[0].name);
            //console.log(req.body.query);
            res.render('searchResult', {
            query: req.body.query,
            link: '/search',
            image: '',
            comment: ". That name has not been registered on Bandcamp!"
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
