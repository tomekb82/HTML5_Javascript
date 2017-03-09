self.addEventListener("message", function(e) {

     var counter = e.data;
    
     for(var i = 0; i < counter; i++) {
        setTimeout(1000);
        console.log("calculating...");
    }

    self.postMessage("calculating in worker");

}, false);