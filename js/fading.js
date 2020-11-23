// Fade In
$(document).ready(function() {
      $('body').css('display', 'none');
      $('body').fadeIn(350);
});

// Fade Out
$(document).ready(function() {
      $(".clk").click(function() {
            $("*").fadeOut();
      });
});

// Delay
function delay (URL) { setTimeout( function() { window.location = URL }, 350 ); }