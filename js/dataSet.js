(function() {

var tooltip = document.querySelector("button[data-tooltip='tooltip']");

console.log(tooltip.dataset.placement);

tooltip.dataset.placement = "s";

// tooltip.removeAttribute("data-placement");
// delete tooltip.dataset.placement;
//tooltip.dataset.title = "Wartość";

$(tooltip).data("placement", "s");

// Uruchomienie pluginu jQuery
var params = {};
params.placement = tooltip.dataset.placement;
$(tooltip).powerTip(params);

})();
