if (localStorage.getItem("cookieAccepted") == "true") {
    startAnalytics()
}

function startAnalytics() {
    (function(){
        var id="15295077-f5dc-40c6-8077-e7dd67bc85b5";
        var utcoffset="2";
        var server=document.currentScript.getAttribute("data-server")||"https://counter.dev";
        if(!sessionStorage.getItem("_swa")&&!document.referrer.startsWith(location.protocol+"//"+location.host)){
            setTimeout(function(){
                sessionStorage.setItem("_swa","1");fetch(
                    server+"/track?"+new URLSearchParams({
                        referrer:document.referrer,screen:screen.width+"x"+screen.height,id:id,utcoffset:utcoffset,
                    })
                );
            },4500);
        }
        navigator.sendBeacon(server+"/trackpage",new URLSearchParams({
            id:id,page:window.location.pathname,
        }));
    })();
}