(function() {

NodeList.prototype.css = function(propertyOrObject, value) {

    Array.prototype.forEach.call(this, function(elem) {

        if(typeof propertyOrObject === "object") {
            var cssObject = propertyOrObject;

            for(var prop in cssObject) {
                elem.style[prop] = cssObject[prop];
            }
        } else if(typeof propertyOrObject === "string" && value !== undefined) {
            var prop = propertyOrObject;

            elem.style[prop] = value;
        } else {
            throw new Error("Podano złe parametry!");
        }

    });

    return this;

}

var list = document.querySelector("#lista");
console.log(list);

var listEvenItems = list.querySelectorAll("li:nth-child(even)");
listEvenItems.css("background-color", "green");

var listOddItems = list.querySelectorAll("li:nth-child(odd)");
listOddItems.css("background-color", "grey");

document.querySelectorAll("input:checked").css("margin-right", "50px");

document.querySelectorAll("a[href$='.pdf']").css("text-transform", "uppercase");
document.querySelectorAll("a[href$='.doc']").css("color", "green");

})();