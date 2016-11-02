


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
  showItem: function( item, callback ) {
    Overlay.Show('/equipment/detail/' + item.title + '?owned=' + item.id, function() {
      Equipment.setDetailActions();
      if ( callback ) {
        callback();
      }
    });
  },

  // Add an item to the character's inventory by name
  addItem: function ( itemTitle ) {
    var payload = {
      return: 'equipment',
      partial: 'newest-item',
      flash: true,
      action: 'addItem',
      args: [
        itemTitle
      ]
    };

    doAction( payload, function(reply) {
      $('#item-list').append(reply.partial);
      Overlay.Hide();

      Equipment.setPartialActions($('#item-list > div').last());
    });
  },

  // Add an item to the character's inventory by name
  buyItem: function ( itemTitle ) {
    var payload = {
      return: 'equipment',
      partial: 'newest-item',
      flash: true,
      action: 'addItem',
      args: [
        itemTitle
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
      Equipment.showItem(this.parentNode.dataset);
    });
  },

  // Sets the actions for items in the details box
  setDetailActions: function () {
    $('.add-equipment').click(function(event){
      var title = this.parentNode.dataset.title;
      Equipment.addItem( title );
    });

    $('.buy-equipment').click(function(event){
      var title = this.parentNode.dataset.title;
      Equipment.buyItem( title );
    });

    $('.drop-item').click(function(){
      var id = parseInt(this.parentNode.dataset.id);
      Equipment.dropItem(id, function() {
        Overlay.Hide();
        // Hide the item with the dropped id
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
      // Show the list of types
      $('.item-type').click(function() {
        var category = this.dataset.category;
        Overlay.Show('/equipment/category/' + category, function() {
          $('.add-equipment').click(function(event){
            var name = this.parentNode.dataset.name;
            Equipment.addItem( name );
          });
          $('.info-equipment').click(function(event){
            Equipment.showItem(this.parentNode.dataset);
          });
        });
      });
    });
  });

  Equipment.setPartialActions();

});
