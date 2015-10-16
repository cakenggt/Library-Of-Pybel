length_of_page = 3200;
length_of_title = 25;
length_of_link = 43;
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

function chunk(str, n) {
  var ret = [];
  var i;
  var len;
  for(i = 0, len = str.length; i < len; i += n) {
    ret.push(str.substr(i, n))
  }
  return ret
};

an = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
//digs must be the same length as an
digs = 'abcdefghijklmnopqrstuvwxyz, .aeiouy ';

function search(search_str){
  //randomly generate location numbers
  wall = ''+parseInt(Math.random()*3+1)
  shelf = ''+parseInt(Math.random()*4+1)
  volume = (''+parseInt(Math.random()*31+1)).pad(2)
  page = (''+parseInt(Math.random()*409+1)).pad(3)
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
  return result.substr(result.length-length_of_page);
}

function getTitle(address){
  addressArray = address.split(':');
  hex = addressArray[0];
  locHash = (addressArray[1]+addressArray[2]+
    addressArray[3].pad(2)+4).hashCode();
  Math.seed = Math.abs(locHash);
  result = '';
  for (var i = 0; i < hex.length; i++){
    index = an.indexOf(hex[i]);
    rand = Math.seededRandom(0, an.length);
    newIndex = (index-parseInt(rand)).mod(digs.length);
    newChar = digs[newIndex];
    result += newChar;
  }
  Math.seed = Math.abs(result.hashCode());
  while (result.length < length_of_title){
    index = parseInt(Math.seededRandom(0, digs.length));
    result += digs[index];
  }
  return result.substr(result.length-length_of_title);
}

function searchTitle(search_str){
  //randomly generate location numbers
  wall = ''+parseInt(Math.random()*3+1)
  shelf = ''+parseInt(Math.random()*4+1)
  volume = (''+parseInt(Math.random()*31+1)).pad(2)
  locHash = (wall+shelf+volume+4).hashCode();
  hex = '';
  search_str = search_str.substr(0, length_of_title);
  while (search_str.length < length_of_title){
    search_str += ' ';
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
  return hex+':'+wall+':'+shelf+':'+parseInt(volume)
}

function populateSelect(){
  wall = $('#wall');
  for (var x = 1; x < 5; x++){
    wall.append($("<option></option>")
         .attr("value",x)
         .text(x));
  }
  shelf = $('#shelf');
  for (var x = 1; x < 6; x++){
    shelf.append($("<option></option>")
         .attr("value",x)
         .text(x));
  }
  volume = $('#volume');
  for (var x = 1; x < 33; x++){
    volume.append($("<option></option>")
         .attr("value",x)
         .text(x));
  }
  page = $('#page');
  for (var x = 1; x < 411; x++){
    page.append($("<option></option>")
         .attr("value",x)
         .text(x));
  }
}

function loadPage(address){
  if (address.split(':')[0]){
    $('#result').text(chunk(
      getPage(address), 80).join('\n'));
    $('#title').text(getTitle(address));
  }
  else{
    alert('You must select a hex value')
  }
}

function makeLink(address){
  link = '<a href="'+window.document.location.pathname+'?uid='+parseInt(Math.random()*100)+'#'+address+'">';
  if (address.length > length_of_link-3){
    link += address.substr(0, 30);
    link += '...';
    link += address.substr(address.length-10);
  }
  else{
    link += address;
  }
  link += '</a>';
  return link;
}

$(function(){
  populateSelect();
  if (window.location.hash){
    address = window.location.hash.substr(1)
    loadPage(address);
    addressArray = address.split(':');
    $('#hex').val(addressArray[0]);
    $('#wall').val(addressArray[1]);
    $('#shelf').val(addressArray[2]);
    $('#volume').val(addressArray[3]);
    $('#page').val(addressArray[4]);
  }

  $('#read').on('click', function(){
    hex = $('#hex').val().toUpperCase();
    wall = $('#wall').val();
    shelf = $('#shelf').val();
    volume = $('#volume').val();
    page = $('#page').val();
    address = hex+':'+wall+':'+shelf+':'+volume+':'+page;
    loadPage(address);
    window.location.hash = '#'+address;
  });

  $('#search').on('click', function(){
    search_str = $('#search_str').val().replace(/[-\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase();
    exact_match_text = search_str;
    while (exact_match_text.length < length_of_page){
      exact_match_text += ' ';
    }
    exact_match = search(exact_match_text);
    rand_char = search(search_str);
    title_search = searchTitle(search_str);
    $('#search_results').html(
      'exact match:<br>'+
      makeLink(exact_match)+
      '<br>with random characters<br>'+
      makeLink(rand_char)+
      '<br>title search<br>'+
      makeLink(title_search+':1')
    );
  })
});
