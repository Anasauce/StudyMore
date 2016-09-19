$(function(){

  $('#flip-button').on('click', function(event){
    event.preventDefault();

    $('.front').addClass('front-flip')

    $('.front').hide()
    $('.back').show()
  })

})