function nextImage() {
    prevCurrentImageID = document.querySelector('.image').id
    prevCurrentImageNumber = parseInt(prevCurrentImageID.slice(-1))
    
    if (a && prevCurrentImageNumber <= 3) {
        document.getElementById('image-number').textContent = '00' + (prevCurrentImageNumber + 1)
        document.getElementById(prevCurrentImageID).id = 'image-' + (prevCurrentImageNumber + 1)    
    }
    else if (b && prevCurrentImageNumber >= 2) {
        document.getElementById('image-number').textContent = '00' + (prevCurrentImageNumber - 1)
        document.getElementById(prevCurrentImageID).id = 'image-' + (prevCurrentImageNumber - 1)   
    }
    else {
        document.getElementById('image-number').textContent = '00' + (prevCurrentImageNumber - b)
        document.getElementById(prevCurrentImageID).id = 'image-' + (prevCurrentImageNumber - b)  
    }
}


document.getElementById('next-button').onclick = function() {
    nextImage(a, c = 3)    
}


document.getElementById('prev-button').onclick = function() {
    nextImage(b, c = -3)    
}

setInterval(function() {
    nextImage(a, c = 3)    
}, 9000); 
