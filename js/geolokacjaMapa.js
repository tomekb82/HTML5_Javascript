(function() {

var supportOutput = document.querySelector("#supportOutput"),
    positionOutput = document.querySelector("#positionOutput"),
    findPositionButton = document.querySelector("#findPosition"),
    fromInput = document.querySelector("#from"),
    showRoute = document.querySelector("#showRoute");


function Map(map, options){
    this.initialize(map, options);  
};
  
Map.prototype.initialize = function(map, options){
    this.map = map;
    if(!options.location) return;

    try { google.maps.event.addDomListener(window, "load", this.createMap.bind(this)); } catch(e) { return; };

    this.options = options;
    this.location = this.options.location;
    
    
    this.form = document.querySelector("#mapForm");

    this.fromInput = document.querySelector("#from");
    this.path = new google.maps.DirectionsService(),
    this.pathRender = new google.maps.DirectionsRenderer();

    this.form.onsubmit = function(e) {
        e.preventDefault();

        this.prepareRoute();
    }.bind(this);

    this.checkGeoSupport();
}   

Map.prototype.createMap = function(){
    var loc = this.location.split(","),
        pos = new google.maps.LatLng(loc[0], loc[1]);

    var mapOptions = {
        zoom: 16,
        center: pos,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.mapObj = new google.maps.Map(this.map, mapOptions);
    this.destination = pos;

    var marker = new google.maps.Marker({
        map: this.mapObj,
        position: pos,
        animation: google.maps.Animation.BOUNCE,
        icon: this.options.mapMarker
    });

} 


Map.prototype.handleRoute = function(result, status) {

    if(status != google.maps.DirectionsStatus.OK || !result.routes[0]) {
         alert("Podałeś złe dane!");
        return false;
    }

    this.pathRender.setDirections(result);
    this.fromInput.value = result.routes[0].legs[0].start_address;
    positionOutput.innerHTML = "<b>Aktualna pozycja:</b> " + result.routes[0].legs[0].start_address
                                + " <br>- odległość:" + result.routes[0].legs[0].distance.text
                                + " <br>- czas:" + result.routes[0].legs[0].duration.text;
}
 
Map.prototype.prepareRoute = function(coords) {

    var renderOptions = {
        map: this.mapObj,
        polylineOptions: {
        strokeColor: "#990000",
        strokeWeight: 3,
        strokeOpacity: 1
        },
        suppressMarkers: true
    }

    this.pathRender.setOptions(renderOptions);

    var pathData = {
        origin: coords ? coords : this.fromInput.value,
        destination: this.destination,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    }

    this.path.route(pathData, this.handleRoute.bind(this));

}


Map.prototype.getGeoData = function() {

    positionOutput.classList.remove("hidden");
    positionOutput.innerHTML = "Pobieranie aktualnej lokalizacji, proszę czekać ...";
    
    navigator.geolocation.getCurrentPosition(
        getCurrentPositionOnSuccess.bind(this),
        getCurrentPositionOnError,
        {
            timeout: 500,
            enableHighAccuracy: true
        }
    );

}

function getCurrentPositionOnSuccess(position) {
    this.prepareRoute(position.coords.latitude + "," + position.coords.longitude);
}
    
function getCurrentPositionOnError(errorObj) {

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
    positionOutput.classList.add("alert-danger");
    positionOutput.classList.remove("alert-info");

}

Map.prototype.checkGeoSupport = function(){

    if(navigator.geolocation) {
        var findPositionButton = document.querySelector("#findPosition");

        supportOutput.innerHTML = "Przeglądarka wspiera geolokalizację!";
        supportOutput.classList.add("alert-success");
        setTimeout(function(){ supportOutput.style.display='none'; }, 3000);
        
        findPositionButton.classList.remove("hidden");

        findPositionButton.onclick = function(e) {
            e.preventDefault();

            this.getGeoData();
        }.bind(this);
    }else{
        supportOutput.innerHTML = "Przeglądarka nie wspiera geolokalizacji!";
        supportOutput.classList.add("alert-danger");
    }

}
  
  
var map1 = new Map(
    document.querySelector("#map"),
    { 
        location: "52.2396756,21.012228699999998",
        mapMarker: "img/map_marker.png"
    });
    
    
})();
