
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
