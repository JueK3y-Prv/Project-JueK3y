function fadeOut() {

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

    }