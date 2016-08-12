// seems to be necessary to get the at module, when using a non-local module (?)
//require("AT");

Serial1.setup(115200, { rx: B7, tx : B6 });
// because the "ready" is a "Ready." for v0.50 i used a custom module version
var wifi = require("ESP8266WiFi_0v50").connect(Serial1, function(err) {
  if (err) throw err;
  wifi.reset(function(err) {
    if (err) throw err;
    console.log("starting server");
    require("http").createServer(function (req, res) {
      res.writeHead(200);
      res.end("Hallo Schatz!");
    }).listen(8080);
  });
});