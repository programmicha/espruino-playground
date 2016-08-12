// seems to be necessary to get the at module, when using a non-local module (?)
//require("AT");

Serial1.setup(115200, { rx: B7, tx : B6 });
// because the "ready" is a "Ready." for v0.50 i used a custom module version
var wifi = require("ESP8266WiFi_0v50").connect(Serial1, function(err) {
  if (err) throw err;
  wifi.reset(function(err) {
    if (err) throw err;
    console.log("Connecting to WiFi");
    wifi.connect("labu","bienchen", function(err) {
      if (err) throw err;
      console.log("Connected");
      // Now you can do something, like an HTTP request
      require("http").get("http://www.pur3.co.uk/hello.txt", function(res) {
        console.log("Response: ",res);
        res.on('data', function(d) {
          console.log("--->"+d);
        });
      });
    });
  });
});