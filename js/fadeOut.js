// Fade In
$(document).ready(function() {
      $('*'.css('display', 'none');
      $('*').fadeIn(350);
});

// Delay
function delay (URL) {
    setTimeout( function() {
         window.location = URL
         $("*").fadeOut();
    }, 350 ); 
}