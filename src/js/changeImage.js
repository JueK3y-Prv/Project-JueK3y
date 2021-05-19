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

        cI = 0

        pI ++
        cI++
        nI++

        console.log(pI, cI, nI)
    }
}


document.getElementById('prev-button').onclick = function() {

    prevCurrentImageID = document.querySelector('.image').id
    prevCurrentImageNumber = prevCurrentImageID.slice(-1)

    // alert(prevCurrentImageNumber)


    document.getElementById(prevCurrentImageID).id = 'image-' + (prevCurrentImageNumber - 1)  

}