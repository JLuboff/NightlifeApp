$(document).ready(function(){
let  location = $('#city').val();
if(location !== undefined){
  $.getJSON(`/${location}`, data => {
    data.forEach((biz) => {
      $('#businesses').append(biz + '<br />');
  })
})
} ;
  $('#location').click((e) => {
    $('#businesses').empty();
    $.getJSON(`/${$('#city').val()}`, data => {
      data.forEach((biz) => {
        $('#businesses').append(biz + '<br />');
      })
    })
  })

})
