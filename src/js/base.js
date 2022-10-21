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

// INFO: webAnalytics.js -!- //
if (localStorage.getItem("cookieAccepted") == "true") {
    startAnalytics()
    /* $(document).on("click", "a", function() {
        var hrID = $(this).attr('id');
        var hrURL = $(this).attr("href");
        var hrText = document.getElementById(hrID).innerText;
        if (hrText != "NEXT" || hrText != "PREV") {
            woopra.track("leave page", {
                hyperlink_id: hrID,
                hyperlink_text: hrText,
                leaving_url: hrURL
            })
        }
    }) */
  }
 
// if(!sessionStorage.getItem("_swa")&&document.referrer.indexOf(location.protocol+"//"+location.host)!== 0){fetch("https://counter.dev/track?"+new URLSearchParams({referrer:document.referrer,screen:screen.width+"x"+screen.height,user:"juek3y@gmail.com",utcoffset:"2"}))};sessionStorage.setItem("_swa","1");



function startAnalytics() {



    (function(){
        var id="753188a6-baa3-48ef-94d0-6b797ea30bef";
        var utcoffset=2;
        var server=document.currentScript.getAttribute("data-server")||"https://counter.dev";
        if(!sessionStorage.getItem("_swa")&&!document.referrer.startsWith(location.protocol+"//"+location.host)){
            setTimeout(function(){
                fetch(server+"/track?"+new URLSearchParams({
                    referrer:document.referrer,screen:screen.width+"x"+screen.height,id:id,utcoffset:utcoffset,
                }));
            },4500);
        }
        sessionStorage.setItem("_swa","1");
        navigator.sendBeacon(server+"/trackpage",new URLSearchParams({id:id,page:window.location.pathname,}));
    })();


    /* !function(){var t,o,c,e=window,n=document,r=arguments,a="script",i=["call","cancelAction","config","identify","push","track","trackClick","trackForm","update","visit"],s=function(){var t,o=this,c=function(t){o[t]=function(){return o._e.push([t].concat(Array.prototype.slice.call(arguments,0))),o}};for(o._e=[],t=0;t<i.length;t++)c(i[t])};for(e.__woo=e.__woo||{},t=0;t<r.length;t++)e.__woo[r[t]]=e[r[t]]=e[r[t]]||new s;(o=n.createElement(a)).async=1,o.src="https://static.woopra.com/js/w.js",(c=n.getElementsByTagName(a)[0]).parentNode.insertBefore(o,c)}("woopra");

    woopra.config({
        domain: "juek3y.com",
        outgoing_tracking: true,
        download_tracking: true
    });

    woopra.track(); */
}
