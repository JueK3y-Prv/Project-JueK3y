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

    // Needs to be simplified ASAP
    // Start-Image shows IMG 001, not IMG 003
    // Still wrong images when showing prev img

    if ((currentImageNumber + 1) == 2) {
        $('.image-1').css('display', 'none')
        $('.image-2').css('display', 'block')
        $('.image-3').css('display', 'none')
        $('.image-4').css('display', 'none')
    }
    else if ((currentImageNumber + 1) == 3) {
        $('.image-1').css('display', 'none')
        $('.image-2').css('display', 'none')
        $('.image-3').css('display', 'block')
        $('.image-4').css('display', 'none')
    }
    else if ((currentImageNumber + 1) == 4) {
        $('.image-1').css('display', 'none')
        $('.image-2').css('display', 'none')
        $('.image-3').css('display', 'none')
        $('.image-4').css('display', 'block')
    }
    else if ((currentImageNumber + 1) == 5) {
        $('.image-1').css('display', 'block')
        $('.image-2').css('display', 'none')
        $('.image-3').css('display', 'none')
        $('.image-4').css('display', 'none')
    }
}

document.getElementById('next-button').onclick = function() {
    nextImage(a = true, b = false, c = 3)    
}

document.getElementById('prev-button').onclick = function() {
    nextImage(b = true, c = -3)    
}

setInterval(function() {
    nextImage(a = true, b = false, c = 3)
}, 9000)


var hoverDistort1 = new hoverEffect({
    parent: document.querySelector('.image-1'),
    intensity: 0.4,
    image1: '/src/img/displacement/image-1.jpg',
    image2: '/src/img/displacement/image-2.jpg',
    displacementImage: '/src/img/displacement/filter/4.png'
});

var hoverDistort2 = new hoverEffect({
    parent: document.querySelector('.image-2'),
    intensity: 0.4,
    image1: '/src/img/displacement/img_two.jpg',
    image2: '/src/img/displacement/img_one.jpg',
    displacementImage: '/src/img/displacement/filter/4.png'
});

var hoverDistort3 = new hoverEffect({
    parent: document.querySelector('.image-3'),
    intensity: 0.4,
    image1: '/src/img/displacement/img_one.jpg',
    image2: '/src/img/displacement/img_two.jpg',
    displacementImage: '/src/img/displacement/filter/4.png'
});

var hoverDistort4 = new hoverEffect({
    parent: document.querySelector('.image-4'),
    intensity: 0.4,
    image1: '/src/img/displacement/image-3.jpg',
    image2: '/src/img/displacement/image-4.jpg',
    displacementImage: '/src/img/displacement/filter/4.png'
});