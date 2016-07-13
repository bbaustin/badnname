var express           = require('express'),
    SearchController  = express.Router(),
    bandcamp          = require('bandcamp-scraper'),
    Search            = require(__dirname + '/../models/search'),
    User              = require(__dirname + '/../models/user');





SearchController.route('/userHistory')
  .get(function(req, res) {
    res.render('userHistory');
  });



SearchController.route('/getAll')
  .get(function(req, res) {
    // console.log('oooooooooooooooooooooo');
    // console.log(req.session);
    Search.find({userId: req.session.userId}, function(err, searches) {
      // console.log(searches.length);
      res.json(searches);
    });
  });



SearchController.route('/?') 
  .get(function(req, res) {
    console.log(req.session.userId, 'this is the session variable')
    if (req.session.isLoggedIn === null || req.session === null) {
      res.render('home')
      // console.log(req.session, req.session.isLoggedIn)
    }
    else {

    User.findById(req.session.userId, function(err, user){
      console.log(user, 'this is userfind function')
       res.render('search', {
        username: user.username
      })
    })


   
    }
  })
  .post(function(req, res) {
    // console.log('xxxxxxxxxxxxxxxxxxxxxx');
    // console.log(req.body.query);
    // console.log(req.session.userId);

// COME BACK TO THIS IF U BROKE EVERYTHING
    // Search.create({
    //   query: req.body.query,
    //   userId: req.session.userId,
    //   found: undefined
    // })

///////////  BANDCAMP SCRAPER  ////////////
    bandcamp.search({
      query: req.body.query,
      page: 1
      }, function(error, results) {
        if (error) {
          console.log(error);
          res.send('there was an error with POST /search');
        } 
    /////////  TYPE: ALBUM  /////////    
        else if (results[0].type === 'album') {
          if (req.body.query.toLowerCase() === results[0].artist.toLowerCase()) {
            Search.create({
              query: req.body.query,
              userId: req.session.userId,
              found: true
            })
            res.render('searchResult', {
              query: req.body.query,
              comment: ", but it looks like that band name might be taken.",
              link: results[0].link, 
              image: '<img src=' + results[0].image + '/>', 
            })
          }
        else {
          Search.create({
            query: req.body.query,
            userId: req.session.userId,
            found: false
          })
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
            Search.create({
              query: req.body.query,
              userId: req.session.userId,
              found: true
            })
            res.render('searchResult', {
              query: req.body.query,
              link: results[0].link, 
              image: '<img src=' + results[0].image + '/>',  
              comment: ", but it looks like that band name might be taken."
            })
          }
          else {
            Search.create({
              query: req.body.query,
              userId: req.session.userId,
              found: false
            })
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

module.exports = SearchController;
