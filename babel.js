length_of_link = 43;

chunk = function(str, n) {
  var ret = [];
  var i;
  var len;
  for(i = 0, len = str.length; i < len; i += n) {
    ret.push(str.substr(i, n))
  }
  return ret
};

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
      LibraryOfBabel.getPage(address), 80).join('\n'));
    $('#title').text(LibraryOfBabel.getTitle(address));
  }
  else{
    alert('You must select a hex value')
  }
}

function makeLink(address){
  link = '<a href="'+window.document.location.pathname+'?uid='+parseInt(Math.random()*100)+'#'+address+'">';
  if (address.length > LibraryOfBabel.length_of_link-3){
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
    while (exact_match_text.length < LibraryOfBabel.length_of_page){
      exact_match_text += ' ';
    }
    exact_match = LibraryOfBabel.search(exact_match_text);
    rand_char = LibraryOfBabel.search(search_str);
    title_search = LibraryOfBabel.searchTitle(search_str);
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
