// per default turn display off
digitalWrite(A7, LOW);
/**
 ***************************************************************************************
 * run
 ***************************************************************************************
 */
E.on('init', function() {
  var minutes = ['Punkt',
                 'fuenf nach',
                 'zehn nach',
                 'viertel',
                 ['zehn vor', 'halb'],
                 ['fuenf vor' ,'halb'],
                 'halb',
                 ['fuenf nach', 'halb'],
                 ['zehn nach', 'halb'],
                 'dreiviertel',
                 'zehn vor',
                 'fuenf vor'
                ];
  var hours = ['zwoelf',
               'eins',
               'zwei',
               'drei',
               'vier',
               'fuenf',
               'sechs',
               'sieben',
               'acht',
               'neun',
               'zehn',
               'elf',
               'zwoelf'
              ];
  function getTimesTxt(date){
    if(date.getHours() > 12){
      return [minutes[Math.floor(date.getMinutes()/5)], hours[date.getHours()-12]];
    } else {
      return [minutes[Math.floor(date.getMinutes()/5)], hours[date.getHours()]];
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
    clearScreenTimeOut: 1000,
    hardwareResetTimeOut: 1000,
    spi        : spi,
    cs1Pin     : B6,
    dcPin      : B7,
    resetPin   : A8,
    busyPin    : A5,
    bs1Pin     : A6
    //powerPin   : A7
  });
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
  }, 360000);
  /**
  ***************************************************************************************
  * Display
  ***************************************************************************************
  */
  setInterval(function(display) {
    display.on();
    display.hwReset(function(){
      display.init(function(err){
        display.g.clear(0xFF);
        display.g.setColor(0x00);
        display.g.setRotation(1);
        var fontSize = 20;
        display.g.setFontVector(fontSize);
        var maxTxtLength = 20;
        var colY = 10;
        var colX = 5;
        var txt = getTimesTxt(new Date());
        for(i=0;i<txt.length;i++){
          if(txt[i] instanceof Array) {
            display.g.drawString(txt[i][0], colX, colY);
            colY = colY + fontSize;
            display.g.drawString(txt[i][1], colX, colY);
            colX = colX + display.g.stringWidth(txt[i][1]) + display.g.stringWidth(' ');
          } else {
            display.g.drawString(txt[i], colX, colY);
            colY = colY + fontSize;
          }
        }
        display.g.flip();
        display.refreshScreen(function(err){
          display.off();
        });
      });
    }, {clearScreenColor: 0x00});
  }, 180000, gde021a1);
});
