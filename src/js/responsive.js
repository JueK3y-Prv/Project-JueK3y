$(document).ready(function() {  
    $('input[type="checkbox"]').val(this.checked);

    $('input[type="checkbox"]').change(function() {
          if(this.checked) {
                $('.logo, a').css('color', 'black');
                $('#active').css('color', '#C2C5A2');
                $('.nav-wrapper').css("display", "block");
                $('.nav-wrapper').css("left", "0");
                $('.so-me-resp').css("display", "flex");
          }
          else {
                $('.logo, a').css('color', 'white');
                $('.nav-wrapper').css("display", "none");
                $('.so-me-resp').css("display", "none");
          }
    });
});