var wifi = require("ESP8266WiFi_0v25MyVersion");

Serial1.setup(115200, { rx: B7, tx : B6 });

wifi.connect(Serial1, function(err) {
  if (err) throw err;
  require("http").get("http://www.pur3.co.uk/hello.txt", function(res) {
    console.log("Response: ",res);
    res.on('data', function(d) {
      console.log("--->"+d);
    });
  });
});