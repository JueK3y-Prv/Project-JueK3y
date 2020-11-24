// Delay
function delay (URL) {
    setTimeout( function() {
         window.location = URL
         $("*").fadeOut();
    }, 350 ); 
}