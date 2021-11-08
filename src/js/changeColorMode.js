const theme = localStorage.getItem("theme");
const iconSun = document.getElementById('sun-icon')
const iconMoon = document.getElementById('moon-icon')
const amountChildren = document.querySelector('.image').children.length
// Needs to be simplified

function modeToLight() {
    iconMoon.style.display = 'inline'
    iconSun.style.display = 'none'
    document.documentElement.style.filter = 'invert(0)'
    for (i = 0; i < amountChildren; i++) {
        document.querySelector('.image-' + (i + 1)).style.filter = 'invert(0)'
    }
}
function modeToDark() {
    iconMoon.style.display = 'none'
    iconSun.style.display = 'inline'
    document.documentElement.style.filter = 'invert(1)'
    for (i = 0; i < amountChildren; i++) {
        document.querySelector('.image-' + (i + 1)).style.filter = 'invert(1)'
    }
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
