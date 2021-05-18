
(function() {
    if (document.referrer && document.location.host && document.referrer.match(new RegExp("^https?://" + document.location.host))) {
        document.getElementById("back-link").setAttribute("href", document.referrer);
    }
})();