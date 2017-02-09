(function() {

var komunikat = document.querySelector("#komunikat");
var komunikat2 = document.querySelector("#komunikat2");

document.querySelector("#zmienKlase").addEventListener("click", function() {
    komunikat.classList.toggle("poprawna");
	if(komunikat2.classList.contains("poprawna")){
		komunikat2.classList.remove("poprawna");
		komunikat2.classList.add("bledna", "klasaInna");
	}else{
		komunikat2.classList.remove("bledna");
		komunikat2.classList.add("poprawna", "klasaInna");
	}
}, false);


})();