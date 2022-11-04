// INFO: GSAP code -!- //
gsap.from(".menu > div", 1.6, {
    opacity: 0,
    y: 60,
    ease: Expo.easeInOut,
    delay: 2.4,
});
gsap.from(".brand-logo", 1.6, {
    opacity: 0,
    y: 40,
    ease: Expo.easeInOut,
    delay: 2.4,
});
gsap.from(".header > span", 1.5, {
    top: "-100vh",
    ease: "bounce.out",
    delay: 1,
    stagger: 0.2,
});
gsap.to(".footer span", 0.4, {
    y: -40,
    ease: Expo.easeInOut,
    delay: 2.4,
});

// INFO: changeColorMode.js -!- //
const theme = localStorage.getItem("theme");
const iconSun = document.getElementById('sun-icon')
const iconMoon = document.getElementById('moon-icon')
try {
    const amountChildren = document.querySelector('.image').children.length
}
catch(err) { console.log(err) }
// Needs to be simplified

function modeToLight() {
    iconMoon.style.display = 'inline'
    iconSun.style.display = 'none'
    document.documentElement.style.filter = 'invert(0)'
    try {
        for (i = 0; i < amountChildren; i++) {
            document.querySelector('.image-' + (i + 1)).style.filter = 'invert(0)'
        }
    } catch(err) {}
}
function modeToDark() {
    iconMoon.style.display = 'none'
    iconSun.style.display = 'inline'
    document.documentElement.style.filter = 'invert(1)'
    try {
        for (i = 0; i < amountChildren; i++) {
            document.querySelector('.image-' + (i + 1)).style.filter = 'invert(1)'
        }
    } catch(err) {}
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