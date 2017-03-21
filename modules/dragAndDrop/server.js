

var express = require("express");

var bodyParser = require("body-parser");


var app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.post("/adres", function(request, response){

    console.log(request);
});

app.listen(8080);








