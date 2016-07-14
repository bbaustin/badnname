var express           = require('express'),
    SearchController  = express.Router(),
    bandcamp          = require('bandcamp-scraper'),
    discogs           = require('disconnect').Client,
    Search            = require(__dirname + '/../models/search'),
    User              = require(__dirname + '/../models/user');
    var timeout = require('connect-timeout');





SearchController.route('/userHistory')
  .get(function(req, res) {
    res.render('userHistory');
  });



SearchController.route('/getAll')
  .get(function(req, res) {
    Search.find({userId: req.session.userId}, function(err, searches) {
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
  .post(function(req, res, next) {
     // if (!req.timeout) {
     //  next();
     // }
    var foundCounter = 0; 
    Search.create({
      query: req.body.query,
      userId: req.session.userId,
      found: false
    })
///////////  DISCOGS  ////////////
    var db = new discogs({
      consumerKey: process.env.PUBLIC_KEY, 
      consumerSecret: process.env.SECRET_KEY}).database();

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
            foundCounter += 2;
            console.log('It looks like ' + req.body.query + ' has something on Discogs');
            Search.find({query: req.body.query}, function (err, toUpdate) {
              for (var j = 0; j < toUpdate.length; j++) {
              toUpdate[j].update({found:true}, function (err, raw) {
                if (err) console.log(err);
                console.log(raw);
              });
              }
            })
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
          console.log('BAND CAMP ALBUM SEARCH');
          if (req.body.query.toLowerCase() === results[0].artist.toLowerCase()) {
            foundCounter++;
            Search.find({query: req.body.query}, function (err, toUpdate) {
              for (var i = 0; i < toUpdate.length; i++) {
                toUpdate[i].update({found:true}, function (err, raw) {
                if (err) console.log(err);
                  console.log(raw);
                });
                }
              })
            }
          }
    /////////  TYPE: ARTIST  /////////    
        else if (results[0].type === 'artist') {
          console.log('BAND CAMP ARTIST SEARCH');          
          if (req.body.query.toLowerCase() === results[0].name.toLowerCase()) {
            foundCounter++;
            Search.find({query: req.body.query}, function (err, toUpdate) {
              for (var i = 0; i < toUpdate.length; i++) {
              toUpdate[i].update({found:true}, function (err, raw) {
                if (err) console.log(err);
                console.log(raw);
              });
              }
            })
          }
      }
    console.log(foundCounter);
    if (foundCounter === 0) {
      res.render('searchResult', {
        query: req.body.query,
        link: '/search',
        image: '',
        comment: '.<br/> It looks like that band name is still available.'
      })
    }
    else if (foundCounter%2 === 0) { // only found on discogs 
      res.render('searchResult', {
        query: req.body.query,
        link: '/search', // Change this to a discogs link :D 
        image: '',
        comment: '.<br/> Sorry, but it looks like that band name has been taken already. Try again!'
      })
    }
    else if (foundCounter%2 === 1) { // found on bandcamp, and potentially discogs
      res.render('searchResult', {
        query: req.body.query,
        link: results[0].link, 
        image: '<img src=' + results[0].image + '/>',
        comment: '.<br/> Sorry, but it looks like that band name has been taken already. Try again!' 
      })
    } 
  })

})










//     var db = new discogs({
//              consumerKey: process.env.PUBLIC_KEY, 
//              consumerSecret: process.env.SECRET_KEY}).database();
//         db.search([req.body.query], ['artist'], function(err, data){
//           console.log(data);
//           if (err) {
//             console.log('your discogs thing has error ' + err);
//           }
//           else if (data.pagination.items===0) { 
//             console.log(req.body.query + " is not found on discogs");
//           }
//           else {
//             for (var i = 0; i < data.results.length; i++) {
//               if (data.results[i].type === 'artist' && data.results[i].title.toLowerCase() === req.body.query.toLowerCase()){
//                 console.log('It looks like ' + req.body.query + ' has something on Discogs');
//                 i = data.results.length;
//               }
//               else {
//                 console.log('I dont think ' + req.body.query + ' is an existing band name');
//               }
//             }
//           }
//         })
// ///////////  BANDCAMP SCRAPER  ////////////
//     bandcamp.search({
//       query: req.body.query,
//       page: 1
//       }, function(error, results) {
//         if (error) {
//           console.log(error);
//           res.send('there was an error with POST /search');
//         } 
//     /////////  TYPE: ALBUM  /////////    
//         else if (results[0].type === 'album') {
//           if (req.body.query.toLowerCase() === results[0].artist.toLowerCase()) {
//             Search.create({
//               query: req.body.query,
//               userId: req.session.userId,
//               found: true
//             })
//             res.render('searchResult', {
//               query: req.body.query,
//               comment: ", but it looks like that band name might be taken.",
//               link: results[0].link, 
//               image: '<img src=' + results[0].image + '/>', 
//             })
//           }
//         else {
//           Search.create({
//             query: req.body.query,
//             userId: req.session.userId,
//             found: false
//           })
//           res.render('searchResult', {
//             query: req.body.query,
//             comment: ". That bandname is not registered on Bandcamp!",
//             link: '/search',
//             image: ''
//           })
//         }
//       }
//     /////////  TYPE: ARTIST  /////////    

//         else if (results[0].type === 'artist') {

//           if (req.body.query.toLowerCase() === results[0].name.toLowerCase()) {
//             Search.create({
//               query: req.body.query,
//               userId: req.session.userId,
//               found: true
//             })
//             res.render('searchResult', {
//               query: req.body.query,
//               link: results[0].link, 
//               image: '<img src=' + results[0].image + '/>',  
//               comment: ", but it looks like that band name might be taken."
//             })
//           }
//           else {
//             Search.create({
//               query: req.body.query,
//               userId: req.session.userId,
//               found: false
//             })
//             res.render('searchResult', {
//               query: req.body.query,
//               link: '/search',
//               image: '',
//               comment: ". That name has not been registered on Bandcamp!"
//           })
//         }
//       }
//     });
//   });

module.exports = SearchController;
