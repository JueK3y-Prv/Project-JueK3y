// FIXME: new CircleType(document.getElementById('image-circle')) -!- //

let open1 = false
let open2 = false
let open3 = false

$('#dd-1').on('click', () => {
    setTimeout(() => {
        if (open1) {
            $('#dd-1-nmb').text('+')
            open1 = false
        }
        else {
            $('#dd-1-nmb').text('-')
            open1 = true
        }
    }, 750)
})

$('#dd-2').on('click', () => {
    setTimeout(() => {
        if (open2) {
            $('#dd-2-nmb').text('+')
            open2 = false
        }
        else {
            $('#dd-2-nmb').text('-')
            open2 = true
        }
    }, 750)
})

$('#dd-3').on('click', () => {
    setTimeout(() => {
        if (open3) {
            $('#dd-3-nmb').text('+')
            open3 = false
        }
        else {
            $('#dd-3-nmb').text('-')
            open3 = true
        }
    }, 750)
})


$('#digital').on('click', () => {
    $('.digital').css('display', 'block')
    $('.crypto').css('display', 'none')
})
$('#crypto').on('click', () => {
    $('.digital').css('display', 'none')
    $('.crypto').css('display', 'block')
})

$('#dd-3').on('click', () => {
    $('.digital').css('display', 'none')
    $('.crypto').css('display', 'none')
})

// INFO: dropdown.js -!- //

let parent = document.querySelectorAll("[data-collapse");
parent.forEach((element) => {
    let clickTarget = element.querySelector("*");
    let collapseElement = element.nextElementSibling;
    let collapseElementChildren = collapseElement.children;
    let tl = new TimelineMax({
        reversed: true,
        paused: true,
    });

    tl.from(
        collapseElement,
        1.6,
        {
            className: "+=heightZero",
            ease: Expo.easeInOut,
        },
        "open"
    );
    tl.staggerFrom(
        collapseElementChildren,
        1,
        {
            autoAlpha: 0,
            y: "40%",
            ease: Expo.easeInOut,
        },
        0.08,
        "open+=.1"
    );

    clickTarget.addEventListener("click", () => {
        tl.reversed() ? tl.play() : tl.reverse();
    });
});