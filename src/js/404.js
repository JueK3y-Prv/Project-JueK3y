// INFO: GSAP code -!- //
gsap.from('.menu > div', 1.6, {
    opacity: 0,
    y: 60,
    ease: Expo.easeInOut,
    delay: 2.4,
});
gsap.from('.brand-logo', 1.6, {
    opacity: 0,
    y: 40,
    ease: Expo.easeInOut,
    delay: 2.4,
});
gsap.from('.header > span', 1.5, {
    top: '-100vh',
    ease: 'bounce.out',
    delay: 1,
    stagger: 0.2,
});
gsap.to('.footer span', 0.4, {
    y: -40,
    ease: Expo.easeInOut,
    delay: 2.4,
});
gsap.to('.footer-wrapper', 0.5, {
    display: 'none',
    delay: 2.6,
})

// INFO: changeColorMode.js -!- //
const theme = localStorage.getItem('theme');
const iconSun = document.getElementById('sun-icon')
const iconMoon = document.getElementById('moon-icon')
const linkColor = document.getElementById('footer-link')
// Needs to be simplified

function modeToLight() {
    iconMoon.style.display = 'inline'
    iconSun.style.display = 'none'
    document.documentElement.style.filter = 'invert(0)'
    linkColor.style.color = '#ad1232'
}
function modeToDark() {
    iconMoon.style.display = 'none'
    iconSun.style.display = 'inline'
    document.documentElement.style.filter = 'invert(1)'
    linkColor.style.color = '#5000eb' // It's actually #afff14
}

if (theme) {
    if (theme === 'dark') {
        modeToDark()
    }
    else {
        modeToLight()
    }
}
else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    modeToDark()
}
else {
    modeToLight()
}

iconSun.onclick = () => {
    if (localStorage.getItem('cookieAccepted') === 'true') {
        localStorage.setItem('theme', 'light');
    }
    modeToLight();
};
iconMoon.onclick = () => {
    if (localStorage.getItem('cookieAccepted') === 'true') {
        localStorage.setItem('theme', 'dark');
    }
    modeToDark();
};