var pI = 2
var cI = 3
var nI = 4

document.getElementById('next-button').onclick = function() {

    if (nI <= 4) {
        currentImage = 'image-' + (cI)
        nextImage = 'image-' + (nI)
    
        document.getElementById(currentImage).id = nextImage


        currentImageNumber = '00' + (nI)

        document.getElementById('image-number').textContent = currentImageNumber
        
        if (pI == 4) {
            pI = 0
        }

        pI++

        cI++
        nI++

        console.log(pI, cI, nI)
    }

    else {
        pI = 3
        cI = 4
        nI = 1
        
        currentImage = 'image-' + (cI)
        nextImage = 'image-' + (nI)
    
        document.getElementById(currentImage).id = nextImage
    

        currentImageNumber = '00' + (nI)

        document.getElementById('image-number').textContent = currentImageNumber


        pI ++

        cI = 0
        
        cI++
        nI++

        console.log(pI, cI, nI)
    }
}


/*
document.getElementById('prev-button').onclick = function() {
    
    use_pI(pI)
    use_cI(cI)
    use_nI(nI)


    console.log(pI, cI, nI)
    

    if (nI <= 4) {
        currentImage = 'image-' + (cI)
        nextImage = 'image-' + (nI)
    
        document.getElementById(currentImage).id = nextImage


        currentImageNumber = '00' + (nI)

        document.getElementById('image-number').textContent = currentImageNumber
    
        cI++
        nI++
    }

    else {
        cI = 4
        nI = 1
        
        currentImage = 'image-' + (cI)
        nextImage = 'image-' + (nI)
    
        document.getElementById(currentImage).id = nextImage
    

        currentImageNumber = '00' + (nI)

        document.getElementById('image-number').textContent = currentImageNumber


        cI = 0
        
        cI++
        nI++
    }
}*/