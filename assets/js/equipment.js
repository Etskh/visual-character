


var Equipment = {

  // Sets the initial state of the page
  init: function() {
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
  },


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
    var url = '/equipment/detail/' + item.title;
    if( item.id ) {
      url += '?owned=' + item.id;
    }
    Overlay.Show(url, function() {
      Equipment.setDetailActions();
      if ( callback ) {
        callback();
      }
    });
  },

  // Add an item to the character's inventory by name
  addItem: function ( itemTitle, count ) {

    if( !count ) {
      return console.error('Equipment.addItem takes 2 arguments');
    }

    var payload = {
      return: 'equipment',
      partial: 'newest-item',
      flash: true,
      action: 'addItem',
      args: [
        itemTitle,
        count
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
      var count = $('#overlay #count').val();
      Equipment.addItem( title, count);
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
};
this.equipment = Equipment;
