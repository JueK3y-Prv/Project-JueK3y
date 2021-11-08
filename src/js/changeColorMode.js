  !function(){var t,o,c,e=window,n=document,r=arguments,a="script",i=["call","cancelAction","config","identify","push","track","trackClick","trackForm","update","visit"],s=function(){var t,o=this,c=function(t){o[t]=function(){return o._e.push([t].concat(Array.prototype.slice.call(arguments,0))),o}};for(o._e=[],t=0;t<i.length;t++)c(i[t])};for(e.__woo=e.__woo||{},t=0;t<r.length;t++)e.__woo[r[t]]=e[r[t]]=e[r[t]]||new s;(o=n.createElement(a)).async=1,o.src="https://static.woopra.com/js/w.js",(c=n.getElementsByTagName(a)[0]).parentNode.insertBefore(o,c)}("woopra");

  woopra.config({
    domain: "juek3y.com",
    outgoing_tracking: true,
    download_tracking: true,
    click_tracking: true
  });

  woopra.track();


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
