var express           = require('express'),
    SearchController  = express.Router(),
    bandcamp          = require('bandcamp-scraper'),
    discogs           = require('disconnect').Client,
    Search            = require(__dirname + '/../models/search'),
    User              = require(__dirname + '/../models/user');



SearchController.route('/getAll')
  .get(function(req, res) {
    Search.find({userId: req.session.userId}, function(err, searches) {
      res.json(searches);
    });
  });
// _id: req.session.userId

SearchController.route('/userHistory')
  .get(function(req, res) {
    res.render('userHistory');
  });

SearchController.route('/?') 
  .get(function(req, res) {
    if (req.session.isLoggedIn === null || req.session === null) {
      res.render('home')
      
      // console.log(req.session, req.session.isLoggedIn)
    }
    else {
    res.render('search', {
      username: req.session.username
      })
    }
  })
  .post(function(req, res) {
///////////  DISCOGS  ////////////
    var db = new discogs({
             consumerKey: 'ASYxbejFTvCfHSryhgKr', 
             consumerSecret: 'NPbNIIhHUrdGYgQMPWIfEyFCIGkwvNeY'}).database();
        db.search([req.body.query], ['artist'], function(err, data){
          console.log(data);
          if (err) {
            console.log('your discogs thing has error ' + err);
          }
          else if (data.pagination.items===0) { 
            console.log(req.body.query + " is not found on discogs");
          }
          else {
            for (var i = 0; i < data.results.length; i++) {
              if (data.results[i].type === 'artist' && data.results[i].title.toLowerCase() === req.body.query.toLowerCase()){
                console.log('It looks like ' + req.body.query + ' has something on Discogs');
                i = data.results.length;
              }
              else {
                console.log('I dont think ' + req.body.query + ' is an existing band name');
              }
            }
          }
        })
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
