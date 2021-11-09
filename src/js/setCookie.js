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
}

!function(){var t,o,c,e=window,n=document,r=arguments,a="script",i=["call","cancelAction","config","identify","push","track","trackClick","trackForm","update","visit"],s=function(){var t,o=this,c=function(t){o[t]=function(){return o._e.push([t].concat(Array.prototype.slice.call(arguments,0))),o}};for(o._e=[],t=0;t<i.length;t++)c(i[t])};for(e.__woo=e.__woo||{},t=0;t<r.length;t++)e.__woo[r[t]]=e[r[t]]=e[r[t]]||new s;(o=n.createElement(a)).async=1,o.src="https://static.woopra.com/js/w.js",(c=n.getElementsByTagName(a)[0]).parentNode.insertBefore(o,c)}("woopra");
  
if (localStorage.getItem("cookieAccepted") == "true") {
    startAnalytics()
}

function startAnalytics() {
    woopra.config({
        domain: "juek3y.com",
        outgoing_tracking: true,
        download_tracking: true,
        click_tracking: true
    });

    woopra.track();
}