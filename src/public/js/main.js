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
      $('#movieList').append("<li>" + searches[i].title + "</li>");
    }
  },
  error: function(err) {
    console.log(err)
  }

}
