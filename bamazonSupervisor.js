/*jshint esversion: 6 */

function AnimalMaker(name) {
  return {
    speak: function() {
      console.log('my name is '+ name);
    }
  };
}

var animalNames = ['sheep', 'liger', 'Big Bird'];

var myAnimal = AnimalMaker(animalNames[0]);
console.log(myAnimal.speak());
// console.log(myAnimal.owner);
