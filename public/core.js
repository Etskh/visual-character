



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
    $('#overlay').click(function() {
      $(this).fadeOut(100);
    });
  }
};


$(document).ready(function(){
  Overlay.Hide();
});
