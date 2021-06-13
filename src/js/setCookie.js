document.getElementById('a-c').onclick = () => {
    // alert("Well... I haven't prepared this yet ")
    setCookie()
};

function setCookie(exdays) {
    var d = new Date()
    // alert(d)
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))  // d.getTime() displays big number
    var expires = "expires=" + d.toUTCString();
    // alert(expires)
    document.cookie = "accept_cookie=true; " + expires + "; path=/"
}