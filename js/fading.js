function fade_in() {
// Fade In
    $(document).ready(function() {
        $('body').css('display', 'none');
        $('body').fadeIn(350);
    });
}

// Delay
function delay (URL) {
    setTimeout( function() {
         window.location = URL
         $("*").fadeOut();
    }, 350 ); 
}