setTimeout(function() {
    const parentHeader = document.getElementById("delete-text")
    parentHeader.innerHTML = ''

    var comingText = document.createElement('h1')
    comingText.innerHTML = 'Coming'
    comingText.className = 'header-1'

    var soonText = document.createElement('h1')
    soonText.innerHTML = 'soon'
    soonText.className = 'header-2'

    parentHeader.appendChild(comingText)
    parentHeader.appendChild(soonText)


    if (window.matchMedia('(min-device-width: 905px)').matches) {
        var style = document.createElement('style')
        style.innerHTML = `
        .header-1, .header-2 {
            height: 112px;
            overflow: hidden;
        }
        `
        document.head.appendChild(style)


        let elements = document.querySelectorAll('.header-1')
        repeatPr()

        function repeatPr() {
            elements.forEach(element => {
            let innerText = element.innerText
            element.innerHTML = ''
            
            let textContainer = document.createElement('div')
            textContainer.classList.add('block')
            
            for (let letter of innerText) {
                let span = document.createElement('span')
                span.innerText = letter.trim() === '' ? '\xa0': letter
                span.classList.add('letter')
                span.classList.add('animationHeader')
                textContainer.appendChild(span)
            }
            
            element.appendChild(textContainer)
            element.appendChild(textContainer.cloneNode(true))
            });

            elements = document.querySelectorAll('.header-2')
        }
        repeatPr()
    }

    // Add image back
    document.getElementById('fake-img').remove()
    document.getElementById('real-img').classList.remove('sec-wrapper-img')
    document.getElementById('real-img').classList.add('wrapper-img')
    document.getElementById('real-img').innerHTML = '<div class="image" id="image-3"><div class="image-1"></div><div class="image-2"></div><div class="image-3"></div><div class="image-4"></div></div>'
        


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
    
    function intervalTimer() {
        nextImage(a = true, b = false, c = 3)
    }
    
    var timeOutHandle = setInterval(intervalTimer, 8000)
    
    document.getElementById('next-button').onclick = () => {
        nextImage(a = true, b = false, c = 3)
        clearInterval(timeOutHandle);
        timeOutHandle = setInterval(intervalTimer, 8000)
    }

    document.getElementById('prev-button').onclick = () => {
        nextImage(b = true, c = -3)
        clearInterval(timeOutHandle);
        timeOutHandle = setInterval(intervalTimer, 8000)
    }
    
    
    var hoverDistort1 = new hoverEffect({
        parent: document.querySelector('.image-1'),
        intensity: 0.4,
        image1: '/src/img/displacement/Image-Desert-1.webp',
        image2: '/src/img/displacement/Image-Desert-3.webp',
        displacementImage: '/src/img/displacement/filter/4.png'
    });
    
    var hoverDistort2 = new hoverEffect({
        parent: document.querySelector('.image-2'),
        intensity: 0.4,
        image1: '/src/img/displacement/Image-Goat-1.webp',
        image2: '/src/img/displacement/Image-Goat-2.webp',
        displacementImage: '/src/img/displacement/filter/4.png'
    });
    
    var hoverDistort3 = new hoverEffect({
        parent: document.querySelector('.image-3'),
        intensity: 0.4,
        image1: '/src/img/displacement/Image-Desert-2.webp',
        image2: '/src/img/displacement/Image-Plane-1.webp',
        displacementImage: '/src/img/displacement/filter/4.png'
    });
    
    var hoverDistort4 = new hoverEffect({
        parent: document.querySelector('.image-4'),
        intensity: 0.4,
        image1: '/src/img/displacement/Image-Palme-1.webp',
        image2: '/src/img/displacement/Image-Building-1.webp',
        displacementImage: '/src/img/displacement/filter/4.png'
    });

    
    const theme = localStorage.getItem('theme')
    const amountChildren = document.querySelector('.image').children.length

    if (theme) {
        if (theme == "dark") {
            modeToDark()
            for (i = 0; i < amountChildren; i++) {
                document.querySelector('.image-' + (i + 1)).style.filter = 'invert(1)'
            }
        }
        else {
            modeToLight()
            for (i = 0; i < amountChildren; i++) {
                document.querySelector('.image-' + (i + 1)).style.filter = 'invert(0)'
            }
        }
    }

}, 6300)