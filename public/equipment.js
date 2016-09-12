
$(document).ready(function(){
  $('.owned-item .button.drop').click(function(event){
    var data = event.target.parentNode.dataset;
    var url = '/action';

    var payload = {
      return: 'equipment',
      action: 'dropItem',
      args: [
        data.id
      ]
    };

    $.post(url, payload, function(reply) {
      if( reply.success ) {

        for( stat in reply.stats) {
          $('.stat-' + stat ).text(reply.stats[stat]);
        }

        $('#load-bar #indicator').css('left', reply.stats.current_load_percentage+'%');
        $(event.target.parentNode).hide('fast');
      }
    });
  })
});


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
        $('#header').text(page);
        $('#nav #' + page).addClass('active');
      });
    };
  };

  for( var i=0; i<pages.length; ++i) {
    $('#nav #' + pages[i]).click( pageHandler(pages[i]));
  }
});
