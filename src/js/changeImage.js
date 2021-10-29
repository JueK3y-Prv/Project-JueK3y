function nextImage() {
    const currentImageID = document.querySelector('.image').id
    const idChange = document.getElementById(currentImageID)
    const currentImageNumber = parseInt(currentImageID.slice(-1))
    const imgNumber = document.getElementById('image-number')
    const amountChildren = document.querySelector('.image').children.length

    if (a && currentImageNumber <= (amountChildren - 1)) {
        // If next image & image ID is less than the max. children
        imgNumber.textContent = '00' + (currentImageNumber + 1)
        idChange.id = 'image-' + (currentImageNumber + 1)
        showImage(1)
    }
    else if (b && currentImageNumber >= 2) {
        // If prev image & image ID is bigger than 1
        imgNumber.textContent = '00' + (currentImageNumber - 1)
        idChange.id = 'image-' + (currentImageNumber - 1)
        showImage(-1)
    }
    else {
        // For the switch-points: If image ID is 4 or 1
        imgNumber.textContent = '00' + (currentImageNumber - c)
        idChange.id = 'image-' + (currentImageNumber - c)
        showImage(-c)
    }

    function showImage(n) {
        for (i = 0; i < amountChildren; i++) {
            if (i == (currentImageNumber + n)) {
                $('.image-' + (currentImageNumber + n)).css('display', 'block')
            }
            else if (n == -1) {
                $('.image-' - i).css('display', 'none')
            }
            else {
                $('.image-' + i).css('display', 'none')
            }
        }
    }
    a = false
    b = false
}

document.getElementById('next-button').onclick = () => {
    nextImage(a = true, b = false, c = 3)    
}

document.getElementById('prev-button').onclick = () => {
    nextImage(b = true, c = -3)    
}

setInterval(() => {
    nextImage(a = true, b = false, c = 3)
}, 9000)


var hoverDistort1 = new hoverEffect({
    parent: document.querySelector('.image-1'),
    intensity: 0.4,
    image1: '/src/img/displacement/Image-Desert-1.jpg',
    image2: '/src/img/displacement/Image-Desert-3.jpg',
    displacementImage: '/src/img/displacement/filter/4.png'
});

var hoverDistort2 = new hoverEffect({
    parent: document.querySelector('.image-2'),
    intensity: 0.4,
    image1: '/src/img/displacement/Image-Goat-1.jpg',
    image2: '/src/img/displacement/Image-Goat-2.jpg',
    displacementImage: '/src/img/displacement/filter/4.png'
});

var hoverDistort3 = new hoverEffect({
    parent: document.querySelector('.image-3'),
    intensity: 0.4,
    image1: '/src/img/displacement/Image-Desert-2.jpg',
    image2: '/src/img/displacement/Image-Plane-1.jpg',
    displacementImage: '/src/img/displacement/filter/4.png'
});

var hoverDistort4 = new hoverEffect({
    parent: document.querySelector('.image-4'),
    intensity: 0.4,
    image1: '/src/img/displacement/Image-Neon-1.jpg',
    image2: '/src/img/displacement/Image-Neon-2.jpg',
    displacementImage: '/src/img/displacement/filter/4.png'
});