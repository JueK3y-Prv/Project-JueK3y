function delay_out() {	
    TweenMax.to(".delay_out", 2, {
        delay: 0,
        right: "0%",
        ease: Expo.easeInOut
    })
};

document.getElementById('settings_in').onclick = () => {
    TweenMax.to(".ovl-settings", 2, {
        delay: 0.2,
        left: "66.6%",
        ease: Expo.easeInOut
    })
    TweenMax.to(".settings_title", 2, {
        delay: 0.2,
        left: "66.6%",
        opacity: 100,
        ease: Expo.easeInOut
    })
};

document.getElementById('settings_out').onclick = () => {
    TweenMax.to(".ovl-settings", 2, {
        delay: 0.1,
        x: 645,
        ease: Expo.easeInOut
    })
}

document.getElementById('myBtn').onclick = () => {
    TweenMax.to(".myBtn", 1, {
    y: -100,
    opacity: 0
    });

    TweenMax.to(".side-strip", 2, {
    delay: 0.5,
    opacity: 0,
    y: -40,
    ease: Expo.easeInOut
    });

    TweenMax.to(".social-media ul li", 2, {
    delay: 0.7,
    opacity: 0,
    y: -20,
    ease: Expo.easeInOut
    });

    TweenMax.to(".nav ul li", 2, {
    delay: 0.7,
    opacity: 0,
    y: -20,
    ease: Expo.easeInOut
    });

    TweenMax.to(".logo", 2, {
    delay: 0.9,
    opacity: 0,
    y: -40,
    ease: Expo.easeInOut
    });

    TweenMax.from(".bg", 2, {
    ease: Power2.easeInOut
    });

    TweenMax.to(".bg", 2, {
    delay: 1.5,
    y: "-110%",
    ease: Expo.easeInOut
    });

    TweenMax.to(".overlay-2", 2, {
    delay: 1.9,
    top: "-110%",
    ease: Expo.easeInOut
    });

    TweenMax.from(".content", 2, {
    delay: 2.5,
    opacity: 0,
    ease: Power2.easeInOut
    });

    TweenMax.to(".content", 2, {
    opacity: 1,
    y: -300,
    delay: 2.5,
    ease: Power2.easeInOut
    }); 
};

const text = baffle(".overlay1 h1");

text.set({
        characters : '█▓█ ▒░/▒░ █░▒▓/ █▒▒ ▓▒▓/█ ░█▒/ ▒▓░ █<░▒ ▓/░>',
        speed: 95
});
text.start();
text.reveal(3700);

TweenMax.to(".overlay1 h1", 2, {
        delay: 1.5,
        opacity: 0,
        y: -60,
        ease: Expo.easeInOut
})

TweenMax.to(".overlay1", 2, {
        delay: 2.1,
        top: "-100%",
        ease: Expo.easeInOut
})

TweenMax.from(".logo", 1, {
        delay: 3.1,
        opacity: 0,
        y: 20,
        ease: Expo.easeInOut
})

TweenMax.staggerFrom(".nav ul li", 1, {
        delay: 3.3, 
        opacity: 0, 
        y: 20, 
        ease: Expo.easeInOut
}, 0.2)

TweenMax.staggerFrom(".language", 1, {
        delay: 3.8, 
        opacity: 0, 
        y: 20, 
        ease: Expo.easeInOut
}, 0.2)

TweenMax.staggerFrom(".social-media ul li", 1, {
        delay: 3.3, 
        opacity: 0, 
        y: 20, 
        ease: Expo.easeInOut
}, 0.2)

TweenMax.from(".side-strip", 2, {
        delay: 3.4,
        opacity: 0,
        y: 40,
        ease: Expo.easeInOut
})

TweenMax.from(".myBtn", 2, {
        delay: 3.6,
        opacity: 0,
        y: -40,     //y: 40
        ease: Expo.easeInOut
})

TweenMax.from(".nav-btn", 1, {
        delay: 3.8,
        opacity: 0,
        x: 20,
        ease: Expo.easeInOut
})