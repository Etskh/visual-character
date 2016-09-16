
$(document).ready(function(){
  $('.add-equipment').click(function(event){
    var data = event.target.dataset;
    var payload = {
      return: 'equipment',
      partial: 'newest-item',
      flash: true,
      action: 'addItem',
      args: [
        data.name
      ]
    };

    doAction( payload, function(reply) {
      $('#item-list').append(reply.partial);
      // Now remove the flash after a bit
      setTimeout(function() {
        $('.flash').removeClass('flash');
      }, 500);
      Overlay.Hide();
    });
  })
})
