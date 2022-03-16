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