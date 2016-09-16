



String.prototype.toCamelCase = function() {
    return this
        .replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
        .replace(/\s/g, '')
        .replace(/^(.)/, function($1) { return $1.toLowerCase(); });
}


var Overlay = {
  Show: function(url) {
    $.get(url, {}, function(reply) {
      $('#overlay #window').html(reply);
      $('#overlay').fadeIn(100);
    });
  },
  Hide: function() {
    $('#overlay #close').click();
  }
};


$(document).ready(function(){
  $('#overlay #close').click(function() {
    $('#overlay').fadeOut(100);
  });

  Overlay.Hide();
});

var doAction = function( payload, callback) {
  var url = '/action';

  $.post(url, payload, function(reply) {
    if( reply.success ) {

      for( stat in reply.stats) {
        console.log([
          'changing stat',
          stat,
          'from',
          $('.stat-' + stat ).text(),
          'to',
          reply.stats[stat]
        ].join(' '));
        $('.stat-' + stat ).text(reply.stats[stat]);
      }

      return callback(reply);
    }

    console.log('Error happened');
    console.log(reply);
  });
}
