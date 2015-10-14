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


function int2base(x, base){
  digs = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (x < 0){
    sign = -1;
  }
  else if (x == 0){
    return digs[0];
  }
  else{
    sign = 1;
  }
  x = x*sign;
  digits = [];
  while (x){
      digits.push(digs[x % base]);
      x = parseInt(x/base);
    }
  if (sign < 0){
    digits.push('-');
  }
  digits.reverse();
  return digits.join('');
}

function stringToNumber(iString){
  digs = 'abcdefghijklmnopqrstuvwxyz, .';
  result = new BigNumber(0);
  for (var x = 0; x < iString.length; x++){
    exp = new BigNumber(29).pow(x)
    result = result.add(exp.mul(digs.indexOf(iString[iString.length-x-1])));
  }
  return result;
}

function toText(x){
  digs = 'abcdefghijklmnopqrstuvwxyz, .'
  if (x < 0){
    sign = -1;
  }
  else if (x == 0){
    return digs[0];
  }
  else{
    sign = 1;
  }
  x = x*sign;
  digits = [];
  while (x){
      digits.push(digs[x % 29]);
      x = parseInt(x/29);
    }
  if (sign < 0){
    digits.push('-');
  }
  digits.reverse();
  return digits.join('');
}

function getPage(address){
  items = address.split(':');
  hex_addr = items[0];
  wall = items[1];
  shelf = items[2];
  volume = zfill(items[3], 2);
  page = zfill(items[4], 3);
  loc_int = parseInt(page+volume+shelf+wall);
  key = parseInt(hex_addr, 36);
  key -= loc_int*loc_mult;
  str_36 = int2base(key, 36);
  an = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  result = toText(parseInt(str_36, 36));
  if (result.length < length_of_page){
    //adding pseudorandom chars
    Math.seed = result.hashCode();
    digs = 'abcdefghijklmnopqrstuvwxyz, .'
    while (result.length < length_of_page){
      result += digs[parseInt(Math.seededRandom(0, digs.length))];
    }
  }
  else if (result.length > length_of_page){
    //TODO fix this
    result = result.slice(-length_of_page);
  }
  return result;
}

function zfill(item, length){
  result = item;
  while(result.length < length){
    result = '0'+result;
  }
  return result
}

function search(search_str){
  wall = ''+parseInt(Math.random()*4);
  shelf = ''+parseInt(Math.random()*5);
  volume = zfill(''+parseInt(Math.random()*32), 2);
  page = zfill(''+parseInt(Math.random()*410), 3);
  //the string made up of all of the location numbers
  loc_str = page + volume + shelf + wall;
  loc_int = parseInt(loc_str) //make integer;
  an = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  digs = 'abcdefghijklmnopqrstuvwxyz, .';
  hex_addr = '';
  depth = parseInt(Math.random()*(length_of_page-search_str.length));
  //random padding that goes before the text;
  front_padding = '';
  for (var x = 0; x < depth; x++){
    front_padding += digs[parseInt(Math.random()*digs.length)];
  }
  //making random padding that goes after the text
  back_padding = '';
  for (var y = 0; y < length_of_page-(depth+search_str.length); y++){
    back_padding += digs[parseInt(Math.random()*digs.length)];
  }
  search_str = front_padding + search_str + back_padding;
  hex_addr = int2base(stringToNumber(search_str)+(loc_int*loc_mult), 36); //change to base 36 and add loc_int, then make string
  key_str = hex_addr + ':' + wall + ':' + shelf + ':' + volume + ':' + page;
  page_text = getPage(key_str);
  return key_str;
}

//TODO Add search, and main
//TODO search doesn't work, big number evaluates to infinity. This will affect getPage too. Use bigNumber.js downloaded
