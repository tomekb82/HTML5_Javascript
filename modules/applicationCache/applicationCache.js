(function() {

console.log(window.applicationCache);

    
// sprawdz czy przegladarka wspiera history API    
if( !(window.history && history.pushState) ) return;

var search = document.querySelector("#searchInput"),
    rows = document.querySelectorAll("#table tbody tr"),
    timer;

function filterTable() {

    [].forEach.call(rows, function(row) {

        var cells = row.querySelectorAll("td"),
            containsText = false;

        [].forEach.call(cells, function(cell) {
            var text = cell.textContent.toLowerCase(),
                search = searchInput.value.toLowerCase();

            if(text.indexOf(search) != -1)
                containsText = true;
        });

        if(containsText)
            row.style.display = "";
        else
            row.style.display = "none";

    });

}

search.onkeyup = function() {

    clearTimeout(timer);

    timer = setTimeout(function() {

        if(search.value != ""){
            // zapisz wartosc w historii
            window.history.pushState(search.value, "", "#search=" + encodeURI(search.value));
        }

    }, 500);

    filterTable();

}

window.onpopstate = function(e) {
    
    // pobierz dane z historii
    if(e.state !== null) {
        search.value = e.state;
    
    } else {
        // pobierz dane z lokalizacji        
        var searchValue = window.location.hash.split("=").pop();
        search.value = decodeURI(searchValue);
    }
    
    filterTable();

}

})();