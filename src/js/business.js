// Wrong gender selected
$(document).ready(function() {
    $(".gender-wrong").click(function(){
        $('.gender-t-m').show();
        $('.gender-t-m-a').hide();      
        $('.gender-t-f').show(); 
        $('.gender-t-f-a').hide();  
        $('.gender-wrong').hide();  
        $('input[type="radio"]').prop('checked', false);
    });
    $('input[type="radio"]').click(function() {
        //Männlich
        if($(this).attr('id') == 'male') {
            $('.gender-t-m').show();
            $('.gender-t-m-a').show();      
            $('.gender-t-f').hide(); 
            $('.gender-t-f-a').hide(); 
            $('.gender-wrong').show();       
        }
        //Weiblich
        else if($(this).attr('id') == 'female') {
            $('.gender-t-m').hide();  
            $('.gender-t-m-a').hide();      
            $('.gender-t-f').show(); 
            $('.gender-t-f-a').show();  
            $('.gender-wrong').show();  
        }
        //None
        else {
            $('.gender-t-m').hide();
            $('.gender-t-f-a').hide();     
            $('.gender-t-f').hide();
            $('.gender-t-f-a').hide();   
            $('.gender-wrong').hide();  
        }
    });
});

// Required attribute
$(document).ready(function() {
    $(".gender-t-m").click(function() {
        $('.gender-s-m').attr('required', true); 
    });
}); 
$(document).ready(function(){
    $(".gender-t-f").click(function() {
        $('.gender-s-f').attr('required', true); 
        $('.gender-i-m-r').attr('required', false); 
    });
});
$(document).ready(function(){
    $(".gender-wrong").click(function() {
        $('.gender-i-m-r').attr('required', true);
        $('.gender-s-f').attr('required', false); 
        $('.gender-s-m').attr('required', false); 
    });
});

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


$(document).ready(function() { 
    if ($(window).width() > 915) {
        $('.resp4').remove();
    }
})