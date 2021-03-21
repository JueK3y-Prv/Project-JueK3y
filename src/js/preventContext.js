console.log('%c 👋 Hey there! You found the secret Dev Tool Cookie 🍪\n Please keep in mind that the source code and images are copyright protected.\n ~ JueK3y', "display: block; font-size: 13px;")

console.log('%cYou are getting errors that are not because of your browser settings (e.g. ERR_BLOCKED_BY_CLIENT)?\nPlease report them here: https://github.com/JueK3y/juek3y.com/issues/new', "color: #DFC185;")

console.log('%c(C)2020 - ' +  new Date().getFullYear() + ' by JueK3y', "color: grey;")


/* document.oncontextmenu = function() {
    return false;
} */

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