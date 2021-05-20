function nextImage() {
    prevCurrentImageID = document.querySelector('.image').id
    prevCurrentImageNumber = parseInt(prevCurrentImageID.slice(-1))
    if (prevCurrentImageNumber <= 3) {
    
        document.getElementById('image-number').textContent = '00' + (prevCurrentImageNumber + 1)
        document.getElementById(prevCurrentImageID).id = 'image-' + (prevCurrentImageNumber + 1)    

    }
    else {
 
        var test = document.getElementById('image-number').textContent = '00' + (prevCurrentImageNumber - 3)
        document.getElementById(prevCurrentImageID).id = 'image-' + (prevCurrentImageNumber - 3)  

    }
}


document.getElementById('next-button').onclick = function() {
    nextImage()    
}


document.getElementById('prev-button').onclick = function() {

    prevCurrentImageID = document.querySelector('.image').id
    prevCurrentImageNumber = parseInt(prevCurrentImageID.slice(-1))
    // alert(prevCurrentImageNumber)

    if (prevCurrentImageNumber >= 2) {
    
        document.getElementById('image-number').textContent = '00' + (prevCurrentImageNumber - 1)
        document.getElementById(prevCurrentImageID).id = 'image-' + (prevCurrentImageNumber - 1)    

    }

    else {
 
        var test = document.getElementById('image-number').textContent = '00' + (prevCurrentImageNumber + 3)
        document.getElementById(prevCurrentImageID).id = 'image-' + (prevCurrentImageNumber + 3)  

    }
}

setInterval(function() {
    nextImage()
}, 9000); 
