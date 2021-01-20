
function settings_in() {
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
}
  
function delay_out() {	
    TweenMax.to(".delay_out", 2, {
        delay: 0,
        right: "0%",
        ease: Expo.easeInOut
    })
}
  
function settings_out() {
    TweenMax.to(".ovl-settings", 2, {
        delay: 0.1,
        x: 645,
        ease: Expo.easeInOut
    })
}