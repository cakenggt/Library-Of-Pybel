length_of_page = 3239;
loc_mult = Math.pow(30, length_of_page);//TODO evaluates to infinity

Math.seed = 6;

// in order to work 'Math.seed' must NOT be undefined,
// so in any case, you HAVE to provide a Math.seed
Math.seededRandom = function(max, min) {
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

an = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
digs = 'abcdefghijklmnopqrstuvwxyz, .';

function search(search_str){
  //TODO do this function
}

function getPage(address){
  //for each char of hex, it will be turned into the index value in an
  addressArray = address.split(':');
  hex = addressArray[0];
  locHash = (addressArray[1]+addressArray[2]+
    addressArray[3].pad(2)+addressArray[4].pad(3)).hashCode();

  //hash of loc will be used to create a seeded RNG
  //for each calculated value of the rng, it will be subtracted from the index value and modded to len of digs
  //document will be built from the indexes translated into digs
  //any leftover space will be filled with random numbers seeded by the hash of the result so far
}
