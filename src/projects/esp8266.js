// esp8266.js
var serial = Serial1;
var pins = { tx: B6, rx : B7 };
var baud = 115200;
/*function test(baud) {
  serial.removeAllListeners();
  var l="";
  serial.on('data', function(d) {l+=d;});
  serial.setup(baud, pins);
  serial.write("AT+GMR\r\n");
  setTimeout(function(){console.log(JSON.stringify(l));},800);
}
setTimeout(function() { test(9600); }, 2000);
setTimeout(function() { test(115200); }, 3000);
setTimeout(function() { test(57600); }, 4000);
setTimeout(function() { console.log("Done!"); }, 5000);
*/
function sendCommand(command) {
  serial.removeAllListeners();
  var l="";
  serial.on('data', function(d) {l+=d;});
  serial.setup(baud, pins);
  serial.write(command + "\r\n");
  setTimeout(function(){console.log(JSON.stringify(l));},5000);
}
setTimeout(function() { sendCommand("AT+GMR"); }, 2000); // version
setTimeout(function() { sendCommand("AT+RST"); }, 4000); // reset
setTimeout(function() { sendCommand("AT+CWMODE=3"); }, 6000); // set mode: client and access point
//setTimeout(function() { sendCommand("AT+CWLAP"); }, 4000); // show wifi network
setTimeout(function() { sendCommand("AT+CWJAP=\"labu\",\"bienchen\""); }, 8000); // join labu
setTimeout(function() { sendCommand("AT+CIFSR"); }, 10000); // show ip
