$(document).ready(function() {  
    $('input[type="checkbox"]').val(this.checked);

    $('input[type="checkbox"]').change(function() {
        if(this.checked) {
            $('.nav-wrapper').css("display", "block");
            $('.so-me-resp').css("display", "flex");
        }
        else {
            $('.nav-wrapper').css("display", "none");
            $('.so-me-resp').css("display", "none");
        }
    });
});