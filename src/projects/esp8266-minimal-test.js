var serial = Serial1;
var pins = { rx: B7, tx : B6 };
function test(baud) {
  serial.removeAllListeners();
  var l="";
  serial.on('data', function(d) {l+=d;});
  serial.setup(baud, pins);
  serial.write("AT+GMR\r\n");
  setTimeout(function(){console.log(JSON.stringify(l));},3000);
}
setTimeout(function() { test(115200); }, 3000);
setTimeout(function() { console.log("Done!"); }, 5000);