$(document).ready(function(){
  $.ajax(ajax);
})

var ajax = {
  url: '/search/getAll',
  type: 'get', //this is the request. the server makes the get method
  dataType: 'json',
  success: function(searches) {
    console.log(searches);
    for (var i = 0; i < searches.length; i++) {
      if (searches[i].found){
      $('#foundSearches').append('<li>' + searches[i].query + '</li>');
      }
      else {
      $('#notFoundSearches').append('<li span style="color:#38b6a0">' + searches[i].query + '</li>');
      }
    }
  },
  error: function(err) {
    console.log(err)
  }

}
