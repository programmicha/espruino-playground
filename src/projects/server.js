digitalWrite(B9,1); // enable on Pico Shim V2
Serial1.setup(115200, { rx: B7, tx : B6 });
var wifi = require("ESP8266WiFi").connect(Serial1, function(err) {
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