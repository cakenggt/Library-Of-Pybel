(function(exports) {

  LibraryOfBabel = {};

  LibraryOfBabel.length_of_page = 3200;
  LibraryOfBabel.length_of_title = 25;

  seed = 6;

  // in order to work 'seed' must NOT be undefined,
  // so in any case, you HAVE to provide a seed
  seededRandom = function(min, max) {
      max = max || 1;
      min = min || 0;

      seed = (seed * 9301 + 49297) % 233280;
      var rnd = seed / 233280;

      return min + rnd * (max - min);
  }

  hashCode = function(s) {
    var hash = 0, i, chr, len;
    if (s.length == 0) return hash;
    for (i = 0, len = s.length; i < len; i++) {
      chr   = s.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };

  pad = function(s, size) {
    while (s.length < size) s = "0"+s;
    return s;
  }

  Number.prototype.mod = function(n) {
      return ((this%n)+n)%n;
  };

  an = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  //digs must be the same length as an
  digs = 'abcdefghijklmnopqrstuvwxyz, .aeiouy ';

  LibraryOfBabel.search = function(search_str){
    //randomly generate location numbers
    wall = ''+parseInt(Math.random()*3+1)
    shelf = ''+parseInt(Math.random()*4+1)
    volume = pad(''+parseInt(Math.random()*31+1), 2)
    page = pad(''+parseInt(Math.random()*409+1), 3)
    locHash = hashCode((wall+shelf+volume+page));
    hex = '';
    depth = parseInt(Math.random()*(LibraryOfBabel.length_of_page-search_str.length));
    for (var x = 0; x < depth; x++){
      search_str = digs[parseInt(Math.random()*digs.length)] + search_str;
    }
    //hash of loc will be used to create a seeded RNG
    seed = Math.abs(locHash);
    for (var i = 0; i < search_str.length; i++){
      index = digs.indexOf(search_str[i]);
      //for each calculated value of the rng, it will be added to the index value and modded to len of an
      rand = seededRandom(0, digs.length);
      newIndex = (index+parseInt(rand)).mod(an.length);
      newChar = an[newIndex];
      //hex will be built from the indexes translated into an
      hex += newChar;
    }
    return hex+':'+wall+':'+shelf+':'+parseInt(volume)+':'+parseInt(page)
  }

  LibraryOfBabel.getPage = function(address){
    //for each char of hex, it will be turned into the index value in the an string
    addressArray = address.split(':');
    hex = addressArray[0];
    locHash = hashCode(addressArray[1]+addressArray[2]+
      pad(addressArray[3], 2)+pad(addressArray[4], 3));
    //hash of loc will be used to create a seeded RNG
    seed = Math.abs(locHash);
    result = '';
    for (var i = 0; i < hex.length; i++){
      index = an.indexOf(hex[i]);
      //for each calculated value of the rng, it will be subtracted from the index value and modded to len of digs
      rand = seededRandom(0, an.length);
      newIndex = (index-parseInt(rand)).mod(digs.length);
      newChar = digs[newIndex];
      //document will be built from the indexes translated into digs
      result += newChar;
    }
    //any leftover space will be filled with random numbers seeded by the hash of the result so far
    seed = Math.abs(hashCode(result));
    while (result.length < LibraryOfBabel.length_of_page){
      index = parseInt(seededRandom(0, digs.length));
      result += digs[index];
    }
    return result.substr(result.length-LibraryOfBabel.length_of_page);
  }

  LibraryOfBabel.getTitle = function(address){
    addressArray = address.split(':');
    hex = addressArray[0];
    locHash = hashCode(addressArray[1]+addressArray[2]+
      pad(addressArray[3], 2)+4);
    seed = Math.abs(locHash);
    result = '';
    for (var i = 0; i < hex.length; i++){
      index = an.indexOf(hex[i]);
      rand = seededRandom(0, an.length);
      newIndex = (index-parseInt(rand)).mod(digs.length);
      newChar = digs[newIndex];
      result += newChar;
    }
    seed = Math.abs(hashCode(result));
    while (result.length < LibraryOfBabel.length_of_title){
      index = parseInt(seededRandom(0, digs.length));
      result += digs[index];
    }
    return result.substr(result.length-LibraryOfBabel.length_of_title);
  }

  LibraryOfBabel.searchTitle = function(search_str){
    //randomly generate location numbers
    wall = ''+parseInt(Math.random()*3+1)
    shelf = ''+parseInt(Math.random()*4+1)
    volume = pad(''+parseInt(Math.random()*31+1), 2)
    locHash = hashCode(wall+shelf+volume+4);
    hex = '';
    search_str = search_str.substr(0, LibraryOfBabel.length_of_title);
    while (search_str.length < LibraryOfBabel.length_of_title){
      search_str += ' ';
    }
    //hash of loc will be used to create a seeded RNG
    seed = Math.abs(locHash);
    for (var i = 0; i < search_str.length; i++){
      index = digs.indexOf(search_str[i]);
      //for each calculated value of the rng, it will be added to the index value and modded to len of an
      rand = seededRandom(0, digs.length);
      newIndex = (index+parseInt(rand)).mod(an.length);
      newChar = an[newIndex];
      //hex will be built from the indexes translated into an
      hex += newChar;
    }
    return hex+':'+wall+':'+shelf+':'+parseInt(volume)
  }

  exports.LibraryOfBabel = LibraryOfBabel;
})(typeof exports !== 'undefined' ? exports : this);
