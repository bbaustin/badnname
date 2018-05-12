$(document).ready(function(){
  $.ajax(ajax);
});

var ajax = {
  url: '/search/getAll',
  type: 'get',
  dataType: 'json',
  success: function(postings) {
    console.log(postings);
    for (var i = 0; i < postings.length; i++) {
      $('#foundSearches').append('<li>' + postings[i].titleName + 'by ' + postings[i].author + '(' + postings[i].userId + ')</li>');
      console.log(postings[i].titleName);
    }
  },
  error: function(err) {
    console.log(err);
  }
}


