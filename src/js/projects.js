// INFO: Gsap Scroll Trigger
gsap.registerPlugin(ScrollTrigger)

document.addEventListener("DOMContentLoaded", function () {
    const footer = document.querySelector(".footer")
    const lastCard = document.querySelector(".card.scroll")
    const pinnedSections = gsap.utils.toArray(".pinned")

    pinnedSections.forEach((section, index, sections) => {
        let img = section.querySelector(".img")

        let nextSection = sections[index + 1] || lastCard
        let endScalePoint = `top+=${nextSection.offsetTop - section.offsetTop} top`

        gsap.to(section, {
            scrollTrigger: {
                trigger: section,
                start: "top top",
                end:
                    index === sections.length
                        ? `+=${lastCard.offsetHeight / 2}`
                        : footer.offsetTop - window.innerHeight,
                pin: true,
                pinSpacing: false,
                scrub: 1,
                onLeave: () => {
                    if (img) img.style.display = 'none'
                },
                onEnterBack: () => {
                    if (img) img.style.display = 'block'
                }
            }
        })

        gsap.fromTo(img, { scale: 1 }, {
            scale: 0.5,
            ease: "none",
            scrollTrigger: {
                trigger: section,
                start: "top top",
                end: endScalePoint,
                scrub: 1
            }
        })
    })

    const header = document.querySelector(".hero h1")
    ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "+=1000vh",
        scrub: 1,
        onUpdate: (self) => {
            let opacityProgress = self.progress
            header.style.opacity = 1 - opacityProgress
        }
    })
})



// INFO: changeColorMode.js -!- //
const theme = localStorage.getItem('theme')
const iconSun = document.getElementById('sun-icon')
const iconMoon = document.getElementById('moon-icon')
const linkColor = document.getElementById('coding-link')
// Needs to be simplified

function modeToLight() {
    iconMoon.style.display = 'inline'
    iconSun.style.display = 'none'
    document.documentElement.style.filter = 'invert(0)'
    linkColor.style.color = '#ad1232'
    try {
        for (i = 0; i < 4; i++) {
            document.getElementById('image-' + (i + 1)).style.filter = 'invert(0)'
        }
    }
    catch(err) { }
}
function modeToDark() {
    iconMoon.style.display = 'none'
    iconSun.style.display = 'inline'
    document.documentElement.style.filter = 'invert(1)'
    linkColor.style.color = '#5000eb' // It's actually #afff14
    try {
        for (i = 0; i < 4; i++) {
            document.getElementById('image-' + (i + 1)).style.filter = 'invert(1)'
        }
    }
    catch(err) { }
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
    modeToLight()
}
iconMoon.onclick = () => {
    if (localStorage.getItem('cookieAccepted') === 'true') {
        localStorage.setItem('theme', 'dark');
    }
    modeToDark()
}