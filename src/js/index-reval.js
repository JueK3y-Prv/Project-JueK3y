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