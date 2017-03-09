(function() {

if(typeof Worker == undefined) return;

var button = document.querySelector("#calculateBtn"),
    label = document.createElement("div");

label.textContent = "Wybierz przycisk !";   
button.parentElement.appendChild(label);

var worker = new Worker("js/worker.js");

worker.addEventListener("message", function(e) {

  label.textContent = e.data;

}, false);

function calculate() {

    var counter = 1000;
    label.textContent = "start";
    worker.postMessage(counter);

}

button.onclick = calculate;

})();