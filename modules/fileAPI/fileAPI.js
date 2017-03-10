(function() {

if(!window.FileReader) return;
 
var fileInput = document.querySelector("#fileInput"),
    start = document.querySelector("#start"),
    stop = document.querySelector("#stop"),
    progress = document.querySelector("#progress"),
    status = document.querySelector("#status"),
    img, input;

fileInput.onchange = function() {

    var file = this.files[0],
        reader = new FileReader();

    if(img) document.querySelector("#playground").removeChild(img);
    if(input) document.querySelector("#playground").removeChild(input);

    document.querySelector("#fileName").innerHTML = "Nazwa: " + file.name;
    document.querySelector("#fileSize").innerHTML = "Rozmiar: " + file.size;
    document.querySelector("#fileType").innerHTML = "Typ: " + file.type;
    document.querySelector("#fileLastModifiedDate").innerHTML = "Ostatnio zmodyfikowany: " + file.lastModifiedDate.toLocaleDateString();

     /* read image */
     if(file.type.match("image.*")) {

         reader.onload = function() {

             //var blob = new Blob([this.result], {type: "image/jpeg"}); // for blob version
             //var fileURL = window.URL.createObjectURL(blob);// for blob version
             
             img = new Image();
             img.src = this.result;
             //img.src = fileURL;// for blob version

             document.querySelector("#playground").appendChild(img);
             //window.URL.revokeObjectURL(fileURL);// for blob version
             status.innerHTML = "Wczytywanie zakończone sukcesem (readyState = " + this.readyState + ")";
             console.log("Wczytywanie zakończone sukcesem (readyState = " + this.readyState + ")");
         }
         reader.readAsDataURL(file);
         //reader.readAsArrayBuffer(file);// for blob version
     }else if(file.type.match("text.*")){
         reader.onload = function() {
             console.log("Wczytywanie zakończone sukcesem (readyState = " + this.readyState + ")");
         }
         reader.readAsText(file);
     }
    
    reader.onloadstart = function() {
        status.innerHTML = "Start odczytywania. readyState: " + this.readyState;
        console.log("Start odczytywania. readyState: " + this.readyState);
    }

    reader.onloadend = function() {
        status.innerHTML = "Zakończono odczytywanie. readyState: " + this.readyState;
        
        if(file.type.match("text.*")){
            input = new Text();
            input.textContent = this.result;
            document.querySelector("#playground").appendChild(input);
        }
        
        console.log("Zakończono odczytywanie. readyState: " + this.readyState);
    }

    reader.onprogress = function(e) {
        if(e.lengthComputable) {
            var percent = (e.loaded / e.total) * 100;
            progress.value = percent;
        }
    }

    reader.onabort = function() {
        status.innerHTML = "Przerwano odczytywanie pliku. readyState: " + this.readyState;
        console.log("onabort");
    }

    reader.onerror = function() {
        status.innerHTML = "Wystąpił błąd" + "(" + this.error.code + "): " + this.error.message;
        console.log("onerror");
    }

    start.onclick = function() {
        console.log("start....");
        //reader.readAsDataURL(file);
        reader.readAsText(file);
        //reader.readAsArrayBuffer(file);
        //reader.readAsBinaryString(file);
    }

    stop.onclick = function() {
        reader.abort(); // w FF nie zgłasza błędu
    }

}

})();