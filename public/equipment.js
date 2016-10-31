
var Equipment = {

  // Drops an inventory item by id
  dropItem: function ( id, callback) {
    var payload = {
      return: 'equipment',
      action: 'dropItem',
      args: [
        id
      ]
    };

    doAction( payload, function(reply) {
      $('#load-bar #indicator').css('left', reply.stats.current_load_percentage+'%');
      callback();
    });
  },

  // Opens a window with item info
  showItem: function( item ) {
    Overlay.Show('/equipment/' + item.title + '?owned=' + item.id, function() {
      // TODO: this
    });
  },

  // Add an item to the character's inventory by name
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
      $('#item-list').append(reply.partial);
      Overlay.Hide();

      Equipment.setPartialActions($('#item-list > div').last());
    });
  },

  // Sets the actions for items in the player's inventory
  setPartialActions: function ( $elem ) {

    if( !$elem ) {
      $elem = $('.owned-item');
    }

    $elem.find('.name').click(function() {
      var item = this.parentNode.dataset;
      Overlay.Show('/equipment/' + item.title + '?owned=' + item.id, function() {
        Equipment.setDetailActions();
      });
    });
  },

  // Sets the actions for items in the details box
  setDetailActions: function () {
    $('.add-equipment').click(function(event){
      var name = this.parentNode.dataset.name;
      Equipment.addItem( name );
    });
    $('.drop-item').click(function(){
      var id = parseInt(this.parentNode.dataset.id);
      Equipment.dropItem(id, function() {
        Overlay.Hide();
        $('.owned-item').filter(function () {
          return $(this).data('id') === id;
        }).hide();
      })
    });
  },
}

$(document).ready(function(){

  // The (+) at the top of the inventory window
  $('#add-item').click(function(){
    Overlay.Show('/equipment', function(){
      $('.add-equipment').click(function(event){
        var name = this.parentNode.dataset.name;
        Equipment.addItem( name );
      });
      $('.info-equipment').click(function(event){
        var href = this.parentNode.dataset.title
        Overlay.Show('/equipment/' + href, function(){
          Equipment.setDetailActions();
        });
      });
    });
  });

  Equipment.setPartialActions();

});
