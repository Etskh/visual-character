
$(document).ready(function(){
  $('.owned-item .button.drop').click(function(event){
    var data = event.target.parentNode.dataset;
    var url = '/action';

    // itemId: data.id
    
    $.get(url, function(reply) {
      if( reply.success ) {
        $('#load-bar #indicator').css('left', reply.current_load_percentage+'%');
        $(event.target.parentNode).hide('fast');
      }
    });
  })
});
