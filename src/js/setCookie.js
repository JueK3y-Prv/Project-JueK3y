if (document.cookie.match(/^(.*;)?\s*accept_cookies\s*=\s*[^;]+(.*)?$/)) {
    // alert("Cookies can come")
    document.__defineGetter__("cookie", function() { return '';} );
    document.__defineSetter__("cookie", function() {} );
}

document.getElementById("test1").onclick = () => {
    var cookieName = 'accept_cookies'
    var consent = 'true'
    var cookieTimeout = 31536000000

    var date = new Date()
    date.setTime(date.getTime() + cookieTimeout)

    document.cookie = cookieName + '=' + consent + ';expires=' + date.toGMTString() + ';path=/'
}
