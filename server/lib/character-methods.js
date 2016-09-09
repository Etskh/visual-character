'use strict'


const saveCharacter = function(character) {
  return new Promise( function(resolve, reject ) {
    fs.readFile(dataPath, function(error, contents) {
      if(error) {
        return reject({
          file: __FILE__,
          func: 'fs.readFile',
          args: [
            dataPath,
          ],
          error: error,
        })
      }
      try {
        var allCharacterData = JSON.parse(contents);
      }
      catch (error) {
        return reject({
          file: __FILE__,
          func: 'JSON.parse',
          args: [
            contents,
          ],
          error: error,
        })
      }

      _.remove(allCharacterData, { 'id': parseInt(character.id) })
      allCharacterData.push(character.data)

      fs.writeFile(
        dataPath, JSON.stringify(allCharacterData, null, 2),
        function( error ) {
          if ( error ) {
            return reject({
              file: __FILE__,
              func: 'fs.writeFile',
              args: [
                dataPath,
                JSON.stringify(allCharacterData, null, 2)
              ],
              error: error,
            })
          }
          // Reload the character with saved data
          return resolve(character.reload())
        }
      )
    })
  })
}


const dropItem = function(character, id) {
  var items = _.remove(character.data.equipment, {'id': parseInt(id) })
  return saveCharacter(character)
}


module.exports.add = function( characterController ) {
  characterController.save = function() {
    return saveCharacter( characterController )
  }
  characterController.dropItem = function(id) {
    return methods.dropItem(characterController, id)
  }
}
