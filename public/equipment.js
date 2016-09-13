
$(document).ready(function(){
  $('.owned-item .button.drop').click(function(event){
    var data = event.target.parentNode.dataset;
    var payload = {
      return: 'equipment',
      action: 'dropItem',
      args: [
        data.id
      ]
    };

    doAction( payload, function(reply) {
      $('#load-bar #indicator').css('left', reply.stats.current_load_percentage+'%');
      $(event.target.parentNode).hide('fast');
    });
  });


  $('#add-item').click(function(){
    Overlay.Show('/equipment');
  });


});
