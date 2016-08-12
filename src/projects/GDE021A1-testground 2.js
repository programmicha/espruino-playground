/**
 * Represents an GDE021A1 display.
 *
 * @constructor
 * @param {json} config The configuration.
 */
function GDE021A1(config) {
  this.spi                = config.spi;
  this.bs1Pin             = config.bs1Pin;
  this.cs1Pin             = config.cs1Pin;
  this.dcPin              = config.dcPin;
  this.busyPin            = config.busyPin;
  this.resetPin           = config.resetPin;
  this.powerPin           = config.powerPin;
  this.g                  = this.createGraphics();
  this.buffer             = new Uint8Array(this.C.MAX_SCREEN_BYTES);
  this.bitMaskArray       = new Uint8Array([128, 64, 32, 16, 8, 4, 2, 1]);
  this.pixelBitPosArray   = new Array([0, 1], [2, 3], [4, 5], [6, 7]);
}
/** 'public' constants */
GDE021A1.prototype.C = {
  COMMAND_Driver_Output_control                                           : 0x01,
  COMMAND_Reserve2                                                        : 0x02,
  COMMAND_Gate_Driving_voltage_Control                                    : 0x03,
  COMMAND_Source_Driving_voltage_Control                                  : 0x04,
  COMMAND_Reserve5                                                        : 0x05,
  COMMAND_Reserve6                                                        : 0x06,
  COMMAND_Display_Control                                                 : 0x07,
  COMMAND_Reserve8                                                        : 0x08,
  COMMAND_Reserve9                                                        : 0x09,
  COMMAND_Reserve0A                                                       : 0x0A,
  COMMAND_Gate_and_Source_non_overlap_period_Control                      : 0x0B,
  COMMAND_Reserve0C                                                       : 0x0C,
  COMMAND_Reserve0D                                                       : 0x0D,
  COMMAND_Reserve0E                                                       : 0x0E,
  COMMAND_Gate_scan_start_position                                        : 0x0F,
  COMMAND_Deep_Sleep_mode                                                 : 0x10,
  COMMAND_Data_Entry_mode_setting                                         : 0x11,
  COMMAND_SWRESET                                                         : 0x12,
  COMMAND_Reserve13                                                       : 0x13,
  COMMAND_Reserve14                                                       : 0x14,
  COMMAND_Reserve15                                                       : 0x15,
  COMMAND_Reserve16                                                       : 0x16,
  COMMAND_Reserve17                                                       : 0x17,
  COMMAND_Reserve18                                                       : 0x18,
  COMMAND_Reserve19                                                       : 0x19,
  COMMAND_Write_to_temperature_register                                   : 0x1A,
  COMMAND_Read_to_temperature_register                                    : 0x1B,
  COMMAND_Write_Command_to_temperature_sensor                             : 0x1C,
  COMMAND_Load_temperature_register_with_temperature_sensor_reading       : 0x1D,
  COMMAND_Reserve1E                                                       : 0x1E,
  COMMAND_Reserve1F                                                       : 0x1F,
  COMMAND_Master_Activation                                               : 0x20,
  COMMAND_Display_Update_1                                                : 0x21,
  COMMAND_Display_Update_2                                                : 0x22,
  COMMAND_Reserve23                                                       : 0x23,
  COMMAND_Write_Ram                                                       : 0x24,
  COMMAND_Read_Ram                                                        : 0x25,
  COMMAND_Reserve26                                                       : 0x26,
  COMMAND_Reserve27                                                       : 0x27,
  COMMAND_VCOM_Sense                                                      : 0x28,
  COMMAND_VCOM_Sense_Duration                                             : 0x29,
  COMMAND_Program_VCOM_OTP                                                : 0x2A,
  COMMAND_Reserve2B                                                       : 0x2B,
  COMMAND_Write_VCOM_register                                             : 0x2C,
  COMMAND_Read_OTP_Registers                                              : 0x2D,
  COMMAND_Reserve2E                                                       : 0x2E,
  COMMAND_Reserve2F                                                       : 0x2F,
  COMMAND_Program_WS_OTP                                                  : 0x30,
  COMMAND_Reserve31                                                       : 0x31,
  COMMAND_Write_LUT_register                                              : 0x32,
  COMMAND_Read_LUT_register                                               : 0x33,
  COMMAND_Reserve34                                                       : 0x34,
  COMMAND_Reserve35                                                       : 0x35,
  COMMAND_Program_OTP_selection                                           : 0x36,
  COMMAND_OTP_selection_Control                                           : 0x37,
  COMMAND_Reserve38                                                       : 0x38,
  COMMAND_Reserve39                                                       : 0x39,
  COMMAND_Set_dummy_line_period                                           : 0x3A,
  COMMAND_Set_Gate_line_width                                             : 0x3B,
  COMMAND_Border_Waveform_Control                                         : 0x3C,
  COMMAND_Reserve3D                                                       : 0x3D,
  COMMAND_Reserve3E                                                       : 0x3E,
  COMMAND_Reserve3F                                                       : 0x3F,
  COMMAND_Reserve40                                                       : 0x40,
  COMMAND_Reserve41                                                       : 0x41,
  COMMAND_Reserve42                                                       : 0x42,
  COMMAND_Reserve43                                                       : 0x43,
  COMMAND_Set_RAM_X_address_position                                      : 0x44,
  COMMAND_Set_RAM_Y_address_position                                      : 0x45,
  COMMAND_Reserve46                                                       : 0x46,
  COMMAND_Reserve47                                                       : 0x47,
  COMMAND_Reserve48                                                       : 0x48,
  COMMAND_Reserve49                                                       : 0x49,
  COMMAND_Reserve4A                                                       : 0x4A,
  COMMAND_Reserve4B                                                       : 0x4B,
  COMMAND_Reserve4C                                                       : 0x4C,
  COMMAND_Reserve4D                                                       : 0x4D,
  COMMAND_Set_RAM_X_address_counter                                       : 0x4E,
  COMMAND_Set_RAM_Y_address_counter                                       : 0x4F,
  COMMAND_Booster_Feedback_Selection                                      : 0xF0,
  COMMAND_NOP                                                             : 0xFF,
  SPI_MODE_4_LINES                                                        : 0,
  MAX_SCREEN_BYTES                                                        : 3096,
  RAM_X_START_ADDRESS                                                     : 0x00,
  DISPLAY_SIZE_X                                                          : 72,
  DISPLAY_SIZE_Y                                                          : 172,
  /**
   * RAM x address end at 11h(17)->72, because otherwise it would be 1Fh(31)->128,
   * which is too large for this display
   */
  RAM_X_END_ADDRESS                                                       : 0x11,
  RAM_Y_START_ADDRESS                                                     : 0x00,
  /**
   * RAM y address end at ABh(171)->172, because otherwise it would be B3h(179)->180
   * which is too large for this display
   */
  RAM_Y_END_ADDRESS                                                       : 0xAB,
  BOOSTER_FEEDBACK_DEFAULT                                                : 0x1F,
  COLOR_BLACK                                                             : 0x00,
  COLOR_BLACK_4_PIXELS                                                    : 0x00,
  COLOR_WHITE                                                             : 0x03,
  COLOR_WHITE_4_PIXELS                                                    : 0xFF
};
/**
 *
 */
GDE021A1.prototype.powerOn = function() {
  console.log('powerOn');
  digitalWrite(this.powerPin, HIGH);
};
GDE021A1.prototype.powerOff = function() {
  console.log('powerOff');
  digitalWrite(this.powerPin, LOW);
};
GDE021A1.prototype.hwReset = function(callback) {
  console.log('hwReset');
  digitalWrite(this.resetPin, LOW);
  digitalWrite(this.resetPin, HIGH);
  return setTimeout(callback, 1000);
};
/**
 * init display sequence
 */
GDE021A1.prototype.init = function(options, callback) {
  console.log('init');
  // set SPI Mode to 4-line
  digitalWrite(this.bs1Pin, this.C.SPI_MODE_4_LINES);
  // exit deep sleep mode, should be default
  this.sendCommandAndData(this.C.COMMAND_Deep_Sleep_mode, 0x00);
  // data entry mode, address counter update in Y direction
  // 0000 0011 means AM=0 means 'x-mode' and ID=11 means 'x:increment and y:increment'
  // should be default
  this.sendCommandAndData(this.C.COMMAND_Data_Entry_mode_setting, 0x03);
  /**
   * the available ram(180/128/4=5580 bytes) is greater than the part needed
   * for the specific GDE021A1 display 172x72 (172x72/4=3096 bytes)
   * so we need to use the appropriate RAM window
   */
  this.sendCommandAndData(
    this.C.COMMAND_Set_RAM_X_address_position,
    [this.C.RAM_X_START_ADDRESS, this.C.RAM_X_END_ADDRESS]
  );
  this.sendCommandAndData(
    this.C.COMMAND_Set_RAM_Y_address_position,
    [this.C.RAM_Y_START_ADDRESS, this.C.RAM_Y_END_ADDRESS]
  );
  //set RAM x address count to 0;
  this.sendCommandAndData(this.C.COMMAND_Set_RAM_X_address_counter, 0x00);
  //set RAM y address count to 0;
  this.sendCommandAndData(this.C.COMMAND_Set_RAM_Y_address_counter, 0x00);
  //booster feedback used, in page 37
  this.sendCommandAndData(
    this.C.COMMAND_Booster_Feedback_Selection,
    this.C.BOOSTER_FEEDBACK_DEFAULT
  );
  //display updata sequence option ,in page 33
  //enable sequence: clk -> CP
  this.sendCommandAndData(this.C.COMMAND_Display_Update_2, 0xC0);
  // write LUT Register, seems to be the waveform (needed for working display)
  var lutRegisterData = [
              0x00,0x00,0x00,0x55,0x00,0x00,0x55,0x55,0x00,0x55,0x55,0x55,0xAA,0xAA,0xAA,0xAA,
              0x15,0x15,0x15,0x15,0x05,0x05,0x05,0x05,0x01,0x01,0x01,0x01,0x00,0x00,0x00,0x00,
              0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
              0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
              0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
              0x22,0xFB,0x22,0x1B,0x00,0x00,0x00,0x00,0x00,0x00
              ];
  this.sendCommandAndData(this.C.COMMAND_Write_LUT_register, lutRegisterData);
  //vcom
  this.sendCommandAndData(this.C.COMMAND_Write_VCOM_register, 0xA0);
  //board
  this.sendCommandAndData(this.C.COMMAND_Border_Waveform_Control, 0x63);
  //display updata sequence option ,in page 33
  //enable sequence: clk -> CP -> LUT -> initial display -> pattern display
  this.sendCommandAndData(this.C.COMMAND_Display_Update_2, 0xC4);
  // clearscreen if desired
  if(options && options.clearScreenBuffer){
    console.log('clear Screenbuffer');
    return this.clearScreenBuffer(options.clearScreenColor, callback);
  }
  console.log('init done');
  return callback();
};
GDE021A1.prototype.sendCommand = function(command) {
  digitalWrite(this.cs1Pin, HIGH);
  digitalWrite(this.dcPin, LOW);
  this.spi.write(command, this.cs1Pin);
  return;
};
GDE021A1.prototype.prepareSendData = function() {
  digitalWrite(this.cs1Pin, HIGH);
  digitalWrite(this.dcPin, HIGH);
  return;
};
GDE021A1.prototype.sendData = function(data) {
  this.spi.write(data, this.cs1Pin);
  return;
};
GDE021A1.prototype.sendCommandAndData = function(command, data) {
  this.sendCommand(command);
  this.prepareSendData();
  this.sendData(data);
  return;
};
GDE021A1.prototype.checkBusyPin = function(callback) {
  console.log('checkingBusyPin');
  return setWatch(callback, this.busyPin, { repeat:false, edge:'falling' });
};
  /**
   * Clears the display screenbuffer with desired color.
   * 4 Pixels
   * 0x00 = 00000000 = all black
   * 0x55 = 01010101 = light gray
   * 0xAA = 10101010 = dark gray
   * 0xFF = 11111111 = all white
   */
GDE021A1.prototype.clearScreenBuffer = function(clearScreenColor, callback) {
  this.sendCommandAndData(this.C.COMMAND_Set_RAM_X_address_counter, 0x00);
  this.sendCommandAndData(this.C.COMMAND_Set_RAM_Y_address_counter, 0x00);
  /**
   * After this command, data entries will be written
   * into the RAM until another command is written.
   * Address pointers will advance accordingly.
   */
  this.sendCommand(this.C.COMMAND_Write_Ram);
  this.prepareSendData();
  for (i = 0; i < this.C.MAX_SCREEN_BYTES; i++) {
    this.sendData(clearScreenColor);
  }
  this.sendCommand(this.C.COMMAND_NOP); // end write sequence
  //busPin does not work here, seems to be the display driver encapsulates the behaviour
  return setTimeout(callback, 1000);
};
GDE021A1.prototype.refreshScreen = function(callback) {
  this.sendCommand(this.C.COMMAND_Master_Activation);
  return this.closeBump(callback);
};
/**
 * refresh the screen, need to be called by application
 * every time  the screen changed
 * reads busyPin
 */
GDE021A1.prototype.closeBump = function(callback) {
  this.sendCommandAndData(this.C.COMMAND_Display_Update_2, 0x03);
  this.sendCommand(this.C.COMMAND_Master_Activation);
  return this.checkBusyPin(callback);
};
GDE021A1.prototype.setXYCounter = function(xCount, yCount) {
  this.sendCommandAndData(this.C.COMMAND_Set_RAM_X_address_counter, xCount);
  this.sendCommandAndData(this.C.COMMAND_Set_RAM_Y_address_counter, yCount);
};
GDE021A1.prototype.createGraphics = function(){
  var _display = this;
  var g = Graphics.createCallback(
            this.C.DISPLAY_SIZE_X,
            this.C.DISPLAY_SIZE_Y,
            2,
            function(x, y, col){
              _display.setPixel(x, y, col);
          });
  g.clear = function(clearColor){
    _display.buffer.fill(clearColor);
  };
  g.flip = function(){
    _display.setXYCounter(0, 0);
    _display.sendCommandAndData(_display.C.COMMAND_Write_Ram, _display.buffer);
  };
  return g;
};
/**
 * Fills the buffer on the correct position for a pixel and color.
 * examples:
 * 0x3F = 00111111 first pixel black
 * 0xC0 = 11000000 first pixel white
 * 0xFC = 11111100 last pixel black
 * 0xFF = all pixels white
 * 0x00 = all pixels black
 */
GDE021A1.prototype.setPixel = function(x, y, color){
  var xBytePos = (x % 4); // get the pos of the pixel inside the ramXByte (pos 0 - 3)
  var bufferAddress = ((x + (y*this.C.DISPLAY_SIZE_X)) / 4) | 0;
  var byte = this.buffer[bufferAddress];
  for (i=1; i<3; i++){
    if((color & i) !== 0) {
      byte |= this.bitMaskArray[this.pixelBitPosArray[xBytePos][2-i]];
    } else {
      byte &= ~this.bitMaskArray[this.pixelBitPosArray[xBytePos][2-i]];
    }
  }
  this.buffer[bufferAddress] = byte;
};
/**
 ***************************************************************************************
 * run
 ***************************************************************************************
 */
E.on('init', function() {
/**
 ***************************************************************************************
 * Configuration
 ***************************************************************************************
 * possible pin configuration
 * pico - display
 * GND  - GND
 * B5   - SDA
 * B3   - SCL
 * B6   - CS1
 * B7   - D/C
 * A5   - RES
 * A8   - BUsy
 * A6   - BS1 (or pull it low without espruino)
 * A7   - 3.3v
 */
  var spi = SPI1;
  spi.setup({
    mosi: B5,
    sck:  B3
  });
  // create instance
  var display = new GDE021A1({
    spi:      spi,
    cs1Pin:   B6,
    dcPin:    B7,
    resetPin: A8,
    busyPin:  A5,
    bs1Pin:   A6,
    powerPin: A7
  });
/**
 ***************************************************************************************
 * Usage
 ***************************************************************************************
 */
  display.powerOn();
  display.hwReset(function(){
    display.init({clearScreenBuffer:true, clearScreenColor: display.C.COLOR_BLACK_4_PIXELS}, function(err){
      display.g.clear(display.C.COLOR_WHITE_4_PIXELS);
      display.g.setColor(display.C.COLOR_BLACK);
      display.g.setRotation(1);
      display.g.setFontVector(20);
      display.g.drawString('Espruino Pico',10,10);
      display.g.drawString('ROCKS! :-)',20,40);
      display.g.flip();
      // display update
      display.refreshScreen(function(err){
        console.log('closeBump done');
        display.powerOff();
      });
    });
  });
});
