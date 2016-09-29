


$(document).ready(function(){

  $('.owned-item .button.drop').click(function(event){
    var item = this.parentNode;
    Equipment.dropItem( item.dataset.id, function(){
      $(item.parentNode).hide('fast');
    });
  });

  $('#add-item').click(function(){
    Overlay.Show('/equipment', function(){
      $('.add-equipment').click(function(event){
        var name = this.parentNode.dataset.name;
        Equipment.addItem( name );
      });
      $('.info-equipment').click(function(event){
        var name = this.parentNode.dataset.name
        Overlay.Show('/equipment/' + name, function(){
        });
      });
    });
  });


  var Equipment = {
    setInterface: function (reply) {
      $('#load-bar #indicator').css('left', reply.stats.current_load_percentage+'%');
    },

    dropItem: function ( id, callback) {
      var payload = {
        return: 'equipment',
        action: 'dropItem',
        args: [
          id
        ]
      };

      doAction( payload, function(reply) {
        Equipment.setInterface(reply);
        callback();
      });
    },

    showItem: function( itemName ) {
      var payload = {

      };
    },

    addItem: function ( itemName ) {
      var payload = {
        return: 'equipment',
        partial: 'newest-item',
        flash: true,
        action: 'addItem',
        args: [
          itemName
        ]
      };

      doAction( payload, function(reply) {
        Equipment.setInterface(reply);
        $('#item-list').append(reply.partial);
        Overlay.Hide();
      });
    }
  }
});
