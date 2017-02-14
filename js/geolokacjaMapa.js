(function() {

var supportOutput = document.querySelector("#supportOutput"),
    positionOutput = document.querySelector("#positionOutput"),
    findPositionButton = document.querySelector("#findPosition"),
    fromInput = document.querySelector("#from"),
    showRoute = document.querySelector("#showRoute");


if(!navigator.geolocation) {
    supportOutput.innerHTML = "Przeglądarka nie wspiera Geolokalizacji!";
    supportOutput.classList.add("alert-danger");
} else {
    supportOutput.innerHTML = "Przeglądarka wspiera Geolokalizację!";
    supportOutput.classList.add("alert-success");
    findPositionButton.classList.remove("hidden");
}

function onError(errorObj) {

    var errorMessage;

    switch(errorObj.code) {
        case errorObj.PERMISSION_DENIED :
            errorMessage = "Brak pozwolenia na pobranie lokalizacji.";
            break;

        case errorObj.POSITION_UNAVAILABLE :
            errorMessage = "Brak dostępu do sieci.";
            break;

        case errorObj.TIMEOUT :
            errorMessage = "Przekroczono czas oczekiwania.";
            break;
    }

    positionOutput.innerHTML = "<strong>Wystąpił błąd: </strong>" + errorMessage;

}

function onSuccess(position) {
    positionOutput.innerHTML = "Aktualna pozycja: " + position.coords.latitude + "," + position.coords.longitude;
    fromInput.value = position.coords.latitude + "," + position.coords.longitude;
    map.location = position.coords.latitude + "," + position.coords.longitude;
    map.makeMap();
}

var options = {
    timeout: 500
}

showRoute.onclick = function(){
    var loc = fromInput.value.split(",");
    if(loc.length !=2) return;

    map.location = fromInput.value;
    map.makeMap();
}

findPositionButton.onclick = function(e) {

    positionOutput.innerHTML = "Pobieranie aktualnej lokalizacji, proszę czekać ...";

    navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

}

var map = {

    makeMap: function() {

        var loc = this.location.split(","),
            pos = new google.maps.LatLng(loc[0], loc[1]);

        var mapOptions = {
            zoom: 16,
            center: pos,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        this.mapObj = new google.maps.Map(document.querySelector("#map"), mapOptions);
        this.destination = pos;

        var marker = new google.maps.Marker({
            map: this.mapObj,
            position: pos,
            animation: google.maps.Animation.BOUNCE,
            icon: this.options.mapMarker
        });

    },

    init: function(options) {

        if(!options.location) return;

        try { google.maps.event.addDomListener(window, "load", this.makeMap.bind(this)); } catch(e) { return; };

        this.options = options;
        this.location = this.options.location;
     

    }

}

map.init({
    location: "52.1557024,21.07630489999997",
    mapMarker: "img/map_marker.png"
});


})();
