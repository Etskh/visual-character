
$(document).ready(function(){
  $('.add-equipment').click(function(event){
    var data = event.target.dataset;
    var payload = {
      return: 'equipment',
      partial: 'item-partial',
      action: 'addItem',
      args: [
        data.name
      ]
    };

    doAction( payload, function(reply) {
      $('#item-list').append(reply.partial);
      $('#item-list:last-child').addClass('flash');
      setTimeout(function() {
        $('#item-list:last-child').removeClass('flash');
      }, 2000);
      Overlay.Hide();
    });
  })
})
