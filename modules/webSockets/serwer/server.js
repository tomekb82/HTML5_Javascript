var ws = require("nodejs-websocket");

var server = ws.createServer(function(conn) {

    conn.on("text", function(data) {

        var dataObject = JSON.parse(data);

        if(dataObject.type == "join") {
            conn.nickName = dataObject.login;

            sendToAll({
                type: "status",
                message: conn.nickName + " dołączył/a do czatu."
            });
        } else if(dataObject.type == "message") {
            sendToAll({
                type: "message",
                login: conn.nickName,
                message: dataObject.message
            });

        }

	//console.log(data);
	//conn.sendText("Odpowiedz z serwera.");

    });

    conn.on("close", function() {

        if(conn.nickName) {
            sendToAll({
                type: "status",
                message: conn.nickName + " opuścił/a czat."
            });
        }
	//conn.sendText("Zamkniecie serwera.");

    });

    conn.on("error", function(e) {
        console.log("Polaczenie z serwerem zostalo przerwane...");
    });

}).listen(8000, "localhost", function() {
    console.log("Serwer uruchomiony.");
});

function sendToAll(data) {

    var msg = JSON.stringify(data);

    server.connections.forEach(function(conn) {
        conn.sendText(msg);
    });

}
