new CircleType(document.getElementById('rotated')).radius(0)

const theme = localStorage.getItem("theme");
const iconSun = document.getElementById('sun-icon')
const iconMoon = document.getElementById('moon-icon')
const image = document.getElementById('image-filter')


function modeToLight() {
    iconMoon.style.display = 'inline'
    iconSun.style.display = 'none'
    image.style.filter = 'invert(0)'
    document.documentElement.style.filter = 'invert(0)'
}
function modeToDark() {
    iconMoon.style.display = 'none'
    iconSun.style.display = 'inline'
    image.style.filter = 'invert(1)'
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
    localStorage.setItem("theme", "light");
    modeToLight();
};
iconMoon.onclick = () => {
    localStorage.setItem("theme", "dark");
    modeToDark();
};
