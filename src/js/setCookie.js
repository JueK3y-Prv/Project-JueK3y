if (document.cookie.match(/^(.*;)?\s*accept_cookies\s*=\s*[^;]+(.*)?$/)) {
    document.__defineGetter__("cookie", function() { return '';} );
    document.__defineSetter__("cookie", function() {} );

    document.getElementById("accept-cookie").style.display = "None"
    document.getElementById("cookie-accepted").style.display = "Block"
}

document.getElementById("a-c-banner").onclick = () => {
    var cookieName = 'accept_cookies'
    var consent = 'true'
    var cookieTimeout = 31536000000

    var date = new Date()
    date.setTime(date.getTime() + cookieTimeout)

    document.cookie = cookieName + '=' + consent + ';expires=' + date.toGMTString() + ';path=/'
    localStorage.setItem('cookieAccepted', 'true')

    var script= document.createElement('script');
    script.src= '/src/js/webAnalytics.js';
    document.getElementsByTagName('head')[0].appendChild(script);
}