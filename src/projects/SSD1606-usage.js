function drawingFun(display) {
  // set color black for subsequent uses
  display.g.setColor(0x00);
  // set fontsize, see Graphics and Fonts modules for further options
  display.g.setFontVector(20);
  var txt = 'Hello World!';
  var xStart = 22;
  var yStart = 22;
  display.g.drawString(txt, xStart, yStart);
  display.g.drawLine(xStart,44,xStart + display.g.stringWidth(txt),44);
  // create a shadow
  display.g.setColor(0x01);
  display.g.drawString(txt, xStart - 1, yStart - 1);
  // some rectangles
  display.g.setColor(0x03);
  display.g.fillRect(0,0,18,18);
  display.g.setColor(0x02);
  display.g.fillRect(0,18,18,36);
  display.g.setColor(0x01);
  display.g.fillRect(0,36,18,54);
  display.g.setColor(0x00);
  display.g.fillRect(0,54,18,72);
  // a polygon
  display.g.setColor(0x00);
  display.g.fillPoly([30,72,50,52,70,72,80,60,95,50,120,72]);
}
// per default turn display off
digitalWrite(A7, LOW);

// run following code onInit
E.on('init', function() {
  // SPI configuration
  var spi = SPI1;
  spi.setup({
    mosi: B5,
    sck:  B3
  });
  // create display instance
  var display = require('SSD1606').connect({
    displayType: 'GDE021A1',
    spi        : spi,
    cs1Pin     : B6,
    dcPin      : B7,
    resetPin   : A8,
    busyPin    : A5,
    bs1Pin     : A6, // optional, but if not provided, you need to set the correct SPI mode 4-wire by yourself
    powerPin   : A7  // optional, just do not use the on() or off() function if you do not provide it
  });
  // activate the power to run the display, just a comfort function, 
  // you can control the power by yourself as well
  display.on();
  display.hwReset(function(){
    display.init(
      function(err){
        // (optional) fill the internal buffer for all pixels with color white, 
        // without this the default color will be black
        display.g.clear(0xFF);
        // not optional - rotate the display x and y coordinates 90 degrees to the right
        display.g.setRotation(1);
        // from here it shows the normal usage
        // set color black for subsequent uses
        display.g.setColor(0x00);
        // set fontsize, see Graphics and Fonts modules for further options
        //display.g.setFontVector(20);
        //display.g.drawString('Hello World!', 22, 22);
        drawingFun(display);
        // from here it shows the needed part
        // (needed) copy internal buffer to display buffer
        display.g.flip();
        // run the display update
        display.refreshScreen(function(err){
          // do whatever you like here, e.g. turn it off when the update is done
          // again just a comfort function
          display.off();
        });
      },
      // clearScreenColor is optional, but prevents e-paper ghosting
      // shadow of an image may be visible after refreshing (only) parts of the screen
      { clearScreenColor: 0x00 }
    );
  });
});
