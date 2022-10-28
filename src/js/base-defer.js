// INFO: changeColorMode.js -!- //
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

// INFO: landingPage.js -!- //
var textWrapper = document.querySelector('.header-1');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

anime.timeline()
.add({
    targets: '.header-1 .letter',
    translateY: [200,0],
    translateZ: 0,
    opacity: [0,1],
    easing: "easeOutExpo",
    duration: 2000,
    delay: (el, i) => 4800 + 50 * i
});


var textWrapper = document.querySelector('.header-2');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

anime.timeline()
.add({
    targets: '.header-2 .letter',
    translateY: [200,0],
    translateZ: 0,
    opacity: [0,1],
    easing: "easeOutExpo",
    duration: 2000,
    delay: (el, i) => 4800 + 50 * i
});

TweenMax.to(".wrapper", 2, {
    top: "-100vh",
    ease: Expo.easeInOut,
    delay: 3.6
});

TweenMax.to(".wrapper", 2, {
    delay: 5.65,
    opacity: 0
});


var tl = new TimelineMax();

tl.from(".loader", 1.6, {
    scaleY: "0%",
    y: 80,
    ease: Expo.easeInOut,
    delay: 1,
    transformOrigin:"50% 100%"
});

tl.to(".loader", 1.6, {
    height: "20vh",
    scaleY: "0%",
    ease: Expo.easeInOut,
    transformOrigin:"0% -100%"
});

TweenMax.to(".box", 2.4, {
    y: "-100%",
    ease: Expo.easeInOut,
    delay: 3.8,
});

TweenMax.to(".box-some", 2.4, {
    y: "-100%",
    ease: Expo.easeInOut,
    delay: 3.8,
});

var tl = new TweenMax.staggerFrom(".menu > div", 2, {
    opacity: 0,     
    y: 30,
    ease: Expo.easeInOut,
    delay: 4.2
}, 0.1);

var tl = new TweenMax.staggerFrom(".hero-container > div", 2, {
    opacity: 0,     
    y: 30,
    ease: Expo.easeInOut,
    delay: 4.2
}, 0.1);

// INFO: setCookie.js -!- //
if (document.cookie.match(/^(.*;)?\s*accept_cookies\s*=\s*[^;]+(.*)?$/)) {
    document.__defineGetter__("cookie", function() { return '';} );
    document.__defineSetter__("cookie", function() {} );

    document.getElementById("accept-cookie").style.display = "None"
    try {
        document.getElementById("cookie-accepted").style.display = "Block"
    }
    catch(err) {}
}

document.getElementById("a-c-banner").onclick = () => {
    var cookieName = 'accept_cookies'
    var consent = 'true'
    var cookieTimeout = 31536000000

    var date = new Date()
    date.setTime(date.getTime() + cookieTimeout)

    document.cookie = cookieName + '=' + consent + ';expires=' + date.toGMTString() + ';path=/'
    localStorage.setItem('cookieAccepted', 'true')

    var script = document.createElement('script');
    script.src = '/src/js/base.js';
    document.getElementsByTagName('head')[0].appendChild(script);

    document.getElementById("accept-cookie").style.display = "None"
    try {
        document.getElementById("cookie-accepted").style.display = "Block"
    }
    catch(err) {}
}