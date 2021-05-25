function nextImage() {
    currentImageID = document.querySelector('.image').id
    currentImageNumber = parseInt(currentImageID.slice(-1))
    
    if (a && currentImageNumber <= 3) {
        document.getElementById('image-number').textContent = '00' + (currentImageNumber + 1)
        document.getElementById(currentImageID).id = 'image-' + (currentImageNumber + 1)    
    }
    else if (b && currentImageNumber >= 2) {
        document.getElementById('image-number').textContent = '00' + (currentImageNumber - 1)
        document.getElementById(currentImageID).id = 'image-' + (currentImageNumber - 1)   
    }
    else {
        document.getElementById('image-number').textContent = '00' + (currentImageNumber - c)
        document.getElementById(currentImageID).id = 'image-' + (currentImageNumber - c)  
    }

    a = false
    b = false
}


document.getElementById('next-button').onclick = function() {
    nextImage(a = true, c = 3)    
}


document.getElementById('prev-button').onclick = function() {
    nextImage(b = true, c = -3)    
}

setInterval(function() {
    nextImage(a = true, c = 3)    
}, 9000); 
