length_of_page = 3239;
loc_mult = Math.pow(30, length_of_page);//TODO evaluates to infinity

Math.seed = 6;

// in order to work 'Math.seed' must NOT be undefined,
// so in any case, you HAVE to provide a Math.seed
Math.seededRandom = function(min, max) {
    max = max || 1;
    min = min || 0;

    Math.seed = (Math.seed * 9301 + 49297) % 233280;
    var rnd = Math.seed / 233280;

    return min + rnd * (max - min);
}

String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length == 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

String.prototype.pad = function(size) {
  s = this;
  while (s.length < size) s = "0"+s;
  return s;
}

Number.prototype.mod = function(n) {
    return ((this%n)+n)%n;
};

an = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
//digs must be the same length as an
digs = 'abcdefghijklmnopqrstuvwxyz, .aeiouy ';

function search(search_str){
  //randomly generate location numbers
  wall = ''+parseInt(Math.random()*4)
  shelf = ''+parseInt(Math.random()*5)
  volume = (''+parseInt(Math.random()*32)).pad(2)
  page = (''+parseInt(Math.random()*410)).pad(3)
  locHash = (wall+shelf+volume+page).hashCode();
  hex = '';
  depth = parseInt(Math.random()*(length_of_page-search_str.length));
  for (var x = 0; x < depth; x++){
    search_str = digs[parseInt(Math.random()*digs.length)] + search_str;
  }
  //hash of loc will be used to create a seeded RNG
  Math.seed = Math.abs(locHash);
  for (var i = 0; i < search_str.length; i++){
    index = digs.indexOf(search_str[i]);
    //for each calculated value of the rng, it will be added to the index value and modded to len of an
    rand = Math.seededRandom(0, digs.length);
    newIndex = (index+parseInt(rand)).mod(an.length);
    newChar = an[newIndex];
    //hex will be built from the indexes translated into an
    hex += newChar;
  }
  return hex+':'+wall+':'+shelf+':'+parseInt(volume)+':'+parseInt(page)
}

function getPage(address){
  //for each char of hex, it will be turned into the index value in the an string
  addressArray = address.split(':');
  hex = addressArray[0];
  locHash = (addressArray[1]+addressArray[2]+
    addressArray[3].pad(2)+addressArray[4].pad(3)).hashCode();
  //hash of loc will be used to create a seeded RNG
  Math.seed = Math.abs(locHash);
  result = '';
  for (var i = 0; i < hex.length; i++){
    index = an.indexOf(hex[i]);
    //for each calculated value of the rng, it will be subtracted from the index value and modded to len of digs
    rand = Math.seededRandom(0, an.length);
    newIndex = (index-parseInt(rand)).mod(digs.length);
    newChar = digs[newIndex];
    //document will be built from the indexes translated into digs
    result += newChar;
  }
  //any leftover space will be filled with random numbers seeded by the hash of the result so far
  Math.seed = Math.abs(result.hashCode());
  while (result.length < length_of_page){
    index = parseInt(Math.seededRandom(0, digs.length));
    result += digs[index];
  }
  return result;
}
