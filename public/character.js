
$(document).ready(function(){
  var pages = [
    'overworld',
    'combat',
    'magic',
    'equipment',
    'statistics',
    'debug'
  ];

  function pageHandler(page) {
    return function(){
      var url = '/character/1/' + page;
      $('#nav div').removeClass('active');
      $.get(url, {}, function(reply) {
        $('#content').html(reply);
        $('#header').text(page[0].toUpperCase() + page.substring(1));
        $('#nav #' + page).addClass('active');
      });
    };
  };

  for( var i=0; i<pages.length; ++i) {
    $('#nav #' + pages[i]).click( pageHandler(pages[i]));
  }


  $('#nav #overworld').click();
});
