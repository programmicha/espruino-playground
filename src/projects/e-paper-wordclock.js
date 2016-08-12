var minutes = ['Punkt','fuenf nach','zehn nach','viertel','zehn vor halb','fuenf vor halb','halb','fuenf nach halb','zehn nach halb','dreiviertel','zehn vor','fuenf vor'];
var hours = ['zwoelf','eins','zwei','drei','vier','fuenf','sechs','sieben','acht','neun','zehn','elf','zwoelf'];
function getTimesTxt(date){
  if(date.getHours() > 12){
    return minutes[Math.floor(date.getMinutes()/5)] + ' ' + hours[date.getHours()-12];
  } else {
    return minutes[Math.floor(date.getMinutes()/5)] + ' ' + hours[date.getHours()];
  }
}
var spi = SPI1;
spi.setup({
  mosi: B5,
  sck:  B3
});
// create instance
var gde021a1 = require('SSD1606').connect({
  displayType: 'GDE021A1',
  spiMode    : 0,
  spi        : spi,
  cs1Pin     : B6,
  dcPin      : B7,
  resetPin   : A8,
  busyPin    : A5,
  bs1Pin     : A6,
  powerPin   : A7
});
// per default turn display off
digitalWrite(A7, LOW);
/**
 ***************************************************************************************
 * run
 ***************************************************************************************
 */
E.on('init', function() {
  /**
   ***************************************************************************************
   * DCF77 - synchronize Espruino Time with DCF77 signal every xx minutes.
   ***************************************************************************************
   */
  setInterval(function(){
    var watchId;
    var result = require('myDCF77').connect(B1, function(err, date, info) {
      if (err) {
        console.log("Invalid time received: " + err);
      }
      else {
        setTime(date.getTime()/1000);
        console.log('synchronized Espruino with Date from DCF77 ' + date.toString());
        if(watchId) {
          clearWatch(watchId);
          watchId = undefined;
        }
      }
    });
    watchId = result.watchId;
  }, 1200000);
  /**
  ***************************************************************************************
  * Display
  ***************************************************************************************
  */
  setInterval(function(display) {
    console.log('updating display');
    display.on();
    display.hwReset(function(){
      display.init({clearScreenColor: 0x00}, function(err){
        display.g.clear(0xFF);
        display.g.setColor(0x00);
        display.g.setRotation(1);
        display.g.setFontVector(20);
        var maxTxtLength = 20;
        var colY = 10;
        var col1 = [];
        var txt = getTimesTxt(new Date());
        if(txt.length < maxTxtLength){
          display.g.drawString(txtArray.toString(), 5, 10);
        } else {
          txtArray = txt.split(' ');
          if((txtArray[0].length + txtArray[1].length)) < maxTxtLength){
          col1.push();
          } else {
            display.g.drawString(txtArray[0]),5,colY);
            display.g.drawString(txtArray[1]),5,colY*2);
          }
        }
        // check each word for pixel width
        for(i=0;i<txtArray.length;i++){
          display.g.stringWidth(txtArray[i])
        }
        /*
        if(txtArray.length < 2){
          display.g.drawString(txtArray.toString(), 5, 10);
        } else {
          display.g.drawString(txtArray.splice(0,2).join(' '), 5,10);
          display.g.drawString(txtArray.splice(0,2).join(' '), 5,30);
        }*/
        display.g.flip();
        display.refreshScreen(function(err){
          display.off();
        });
      });
    });
  }, 120000, gde021a1);
});
