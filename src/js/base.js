// INFO: webAnalytics.js -!- //
if (localStorage.getItem("cookieAccepted") == "true") {
    startAnalytics()
}

function startAnalytics() {
    (function(){var id=document.currentScript.getAttribute("data-id");var utcoffset=document.currentScript.getAttribute("data-utcoffset");var server=document.currentScript.getAttribute("data-server")||"https://counter.dev";if(!sessionStorage.getItem("_swa")&&!document.referrer.startsWith(location.protocol+"//"+location.host)){setTimeout(function(){sessionStorage.setItem("_swa","1");fetch(server+
    "/track?"+
    new URLSearchParams({referrer:document.referrer,screen:screen.width+"x"+screen.height,id:id,utcoffset:utcoffset,}));},4500);}
    navigator.sendBeacon(server+"/trackpage",new URLSearchParams({id:id,page:window.location.pathname,}));})();
}

// INFO: preventContext.js -!- //
if (window.location.href==="https://juek3y.netlify.app/") {
    window.location.href = "https://juek3y.com/"; 
}

console.log('%cHey 👋 Please keep in mind that the images and source code are copyright protected.', "display: block; font-size: 13px;")

console.log('%cCopyright 2020 - ' +  new Date().getFullYear() + ' by JueK3y', "color: grey;")


document.oncontextmenu = function() {
    return false;
}

document.onkeydown = function(e) {
    if(event.keyCode == 123) {
        return false;
    }
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)){
        return false;
    }
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)){
        return false;
    }
    if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)){
        return false;
    }
    if(e.ctrlKey && e.keyCode == 'S'.charCodeAt(0)){
        return false;
    }
    if(e.ctrlKey && e.keyCode == 'A'.charCodeAt(0)){
        return false;
    }
    if(e.ctrlKey && e.keyCode == 'P'.charCodeAt(0)){
        return false;
    }
}
