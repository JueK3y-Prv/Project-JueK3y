const theme = localStorage.getItem("theme");
const iconSun = document.getElementById('sun-icon')
const iconMoon = document.getElementById('moon-icon')
// Needs to be simplified
const image1 = document.querySelector('.image-1')
const image2 = document.querySelector('.image-2')
const image3 = document.querySelector('.image-3')
const image4 = document.querySelector('.image-4')


function modeToLight() {
    iconMoon.style.display = 'inline'
    iconSun.style.display = 'none'
    image1.style.filter = 'invert(0)'
    image2.style.filter = 'invert(0)'
    image3.style.filter = 'invert(0)'
    image4.style.filter = 'invert(0)'
    document.documentElement.style.filter = 'invert(0)'
}
function modeToDark() {
    iconMoon.style.display = 'none'
    iconSun.style.display = 'inline'
    image1.style.filter = 'invert(1)'
    image2.style.filter = 'invert(1)'
    image3.style.filter = 'invert(1)'
    image4.style.filter = 'invert(1)'
    document.documentElement.style.filter = 'invert(1)'
}


if (theme) {
    if (theme == "dark") {
        modeToDark()
    }
    else {
        modeToLight()
    }
}
else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    modeToDark()
}
else {
    modeToLight()
}


iconSun.onclick = () => {
    if (localStorage.getItem("cookieAccepted") == "true") {
        localStorage.setItem("theme", "light");
    }
    modeToLight();
};
iconMoon.onclick = () => {
    if (localStorage.getItem("cookieAccepted") == "true") {
        localStorage.setItem("theme", "dark");
    }
    modeToDark();
};
