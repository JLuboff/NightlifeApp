$(document).ready(function(){
let  location = $('#city').val();
if(location !== undefined){
  $.getJSON(`/${location}`, data => {
    data.forEach((biz) => {
      let bizId = biz.name.replace(/\s/g, '');
        $('#businesses').append(`
          <div class="card">
            <div class="card-content">
              <p class="title">${biz.name}  </p>
              <p class="subtitle">Rating: ${biz.rating} </p>
            </div>
            <footer class="card-footer">
              <p class="card-footer-item">
                <span><a href="/going/${$('#city').val()}/${biz.name}" class="going" id="${bizId}">Going</a>: <span id="${bizId}Count"> ${biz.count} </span>
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
      let bizId = biz.name.replace(/\s/g, '');
        $('#businesses').append(`
          <div class="card">
            <div class="card-content">
              <p class="title">${biz.name}  </p>
              <p class="subtitle">Rating: ${biz.rating} </p>
            </div>
            <footer class="card-footer">
              <p class="card-footer-item">
                <span><a href="/going/${$('#city').val()}/${biz.name}" class="going" id="${bizId}">Going</a>: <span id="${bizId}Count"> ${biz.count} </span>
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

  $(document).on('click', '.going', (e) => {
    e.preventDefault();
    console.log(`clicked`);
    console.log(e.target.href, e.target.id, this.id);
    $.ajax({
      type: 'POST',
      url: e.target.href,
      success: data => {
        console.log(data.count, e.target.id);
     console.log($('#' + e.target.id + 'Count').html());
      $('#' + e.target.id + 'Count').html(data.count);
      }
    })

    console.log(`First: ${e.target.id} and Second: ${e.target.id + 'Count'}`);
  })

})
//href="/going/${$('#city').val()}/${biz.name}"
