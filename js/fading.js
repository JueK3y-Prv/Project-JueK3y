function fade_in() {
// Fade In
    $(document).ready(function() {
        $('body').css('display', 'none');
        $('body').fadeIn(350);
    });
}

function fade_out() {
    // Fade Out
    $(document).ready(function() {
        $(".clk").click(function() {
                $("*").fadeOut();
        });
    });
}
// Delay
function delay (URL) {
    setTimeout( function() {
         window.location = URL
         $("*").fadeOut();
    }, 350 ); 
}