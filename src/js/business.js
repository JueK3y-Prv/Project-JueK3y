// Wrong gender selected
$(document).ready(function() {
    $(".gender-wrong").click(function(){
        $('.gender-t-m').show()
        $('.gender-t-m-a').hide()      
        $('.gender-t-f').show() 
        $('.gender-t-f-a').hide()  
        $('.gender-wrong').hide()  
        $('input[type="radio"]').prop('checked', false)
        $("#anrede-selection").children().prop('selectedIndex', 0)
    })
    $('input[type="radio"]').click(function() {
        anredeFc($(this).attr('id'))
        //Männlich
        if($(this).attr('id') == 'male') {
            $('.gender-t-m').show()
            $('.gender-t-m-a').show()      
            $('.gender-t-f').hide()  
            $('.gender-t-f').prop('checked', false) 
            $('.gender-t-f-a').hide() 
            $('.gender-t-f-a').prop('checked', false) 
            $('.gender-wrong').show()       
        }
        //Weiblich
        else if($(this).attr('id') == 'female') {
            $('.gender-t-m').hide() 
            $('.gender-t-m').prop('checked', false)  
            $('.gender-t-m-a').hide()    
            $('.gender-t-m-a').prop('checked', false)   
            $('.gender-t-f').show() 
            $('.gender-t-f-a').show()  
            $('.gender-wrong').show()  
        }
        //None
        else {
            $('.gender-t-m').hide()
            $('.gender-t-f-a').hide()     
            $('.gender-t-f').hide()
            $('.gender-t-f-a').hide()   
            $('.gender-wrong').hide()  
        }
    })
})

function anredeFc(gender) {
    let anredeVal = []
    let anredeTx = []
    if (gender === 'female') {
        $("#anrede-selection").attr('class', 'gender-t-f-a')
        $("#anrede-selection").children().attr('id', 'gender-s-f')
        anredeVal = ['Frau', 'Frau Doktor', 'Frau Professor', 'Frau Professor Doktor']
        anredeTx = ['Frau', 'Frau Dr.', 'Frau Prof.', 'Frau Prof. Dr.']
    }
    else if (gender === 'male') {
        $("#anrede-selection").attr('class', 'gender-t-m-a')
        $("#anrede-selection").children().attr('id', 'gender-s-m')
        anredeVal = ['Herr', 'Herr Doktor', 'Herr Professor', 'Herr Professor Doktor']
        anredeTx = ['Herr', 'Herr Dr.', 'Herr Prof.', 'Herr Prof. Dr.']
    }
    
    for (let i = 0; i <= $(".anrede").length; i++) {
        $('#an-'+i).val(anredeVal[i])
        $('#an-'+i).text(anredeTx[i])
    }
}

// Required attribute
$(document).ready(function() {
    $(".gender-t-m").click(function() {
        $('#gender-s-m').attr('required', true) 
    })
}) 
$(document).ready(function(){
    $(".gender-t-f").click(function() {
        $('.gender-s-f').attr('required', true) 
        $('.gender-i-m-r').attr('required', false) 
    })
})
$(document).ready(function(){
    $(".gender-wrong").click(function() {
        $('.gender-i-m-r').attr('required', true)
        $('.gender-s-f').attr('required', false) 
        $('#gender-s-m').attr('required', false) 
    })
})

$(document).ready(function() {  
    $('input[type="checkbox"]').val(this.checked)

    $('input[type="checkbox"]').change(function() {
        if(this.checked) {
            $('.nav-wrapper').css("display", "block")
            $('.so-me-resp').css("display", "flex")
        }
        else {
            $('.nav-wrapper').css("display", "none")
            $('.so-me-resp').css("display", "none")
        }
    })
})


$(document).ready(function() { 
    if ($(window).width() > 915) {
        $('.resp4').remove()
    }
})