$(document).ready(function(){
let  location = $('#city').val();
if(location !== undefined){
  $.getJSON(`/${location}`, data => {
    data.forEach((biz) => {
      $('#businesses').append(`
        <div class="card">
          <div class="card-content">
            <p class="title">${biz.name}  </p>
            <p class="subtitle">Rating: ${biz.rating} </p>
          </div>
          <footer class="card-footer">
            <p class="card-footer-item">
              <span><a href="/going/${biz.name}">Going</a>: <span id="${biz.name}Count">0 </span>
            </p>
            <p class="card-footer-item">
              <span></span>
            </p>
          </footer>
      </div>
        `);
  })
})
} ;
  $('#location').click((e) => {
    $('#businesses').empty();
    $.getJSON(`/${$('#city').val()}`, data => {
      data.forEach((biz) => {
        console.log(biz.name);
        $('#businesses').append(`
          <div class="card">
            <div class="card-content">
              <p class="title">${biz.name}  </p>
              <p class="subtitle">Rating: ${biz.rating} </p>
            </div>
            <footer class="card-footer">
              <p class="card-footer-item">
                <span><a href="/going/${biz.name}">Going</a>: <span id="${biz.name}Count">0 </span>
              </p>
              <p class="card-footer-item">
                <span></span>
              </p>
            </footer>
        </div>
          `);
      })
    })
  })

})
