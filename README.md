# badnname

## Introduction
badnname is an app written by Marie-Claire Balabanian and Ben Austin. badnname allows users to check if their idea for a band name has already been taken. This was the second project in General Assembly's Web Development Immersive.

## Technologies Used
This was built using HTML, CSS, Less, Javascript, jQuery, Node.js, and MongoDB. We also used very useful open source tools to grab information from music websites: [bandcamp scraper](https://github.com/masterT/bandcamp-scraper), and [disconnect](https://github.com/bartve/disconnect) (in conjunction with the [Discogs API](https://www.discogs.com/developers/)).

## Wireframes & User Stories
The user signs up, or logs in if they have a previously created account. From there, they can search band names. The website will give a response letting them know if the band name is taken; links and images to an existing band will be provided if possible. Users can also view their previous searches, which are organized by "already taken" and "still available." They can also log out. 
![wireframe](http://i.imgur.com/bmrh1Hm.png "original wireframe")

## Problems
Some search queries will lead to long load times while scraping bandcamp.  

## Things to Add 
Timing out requests to external sources that are taking too long would be a nice feature. Searching through additional databases would be nice as well. Providing users with more useful information about existing bands would also be nice. Allowing users to delete their previous searches would be a final nice addition. 
