var display            = { displaySizeX: 72, maxScreenBytes: 3096 };
var buffer             = new Uint8Array(display.maxScreenBytes);
var bitMaskArray       = new Uint8Array([128, 64, 32, 16, 8, 4, 2, 1]);
var pixelBitPosArray   = new Array([0, 1], [2, 3], [4, 5], [6, 7]);

/**
 * Maps a pixel to the correct display buffer address.
 *
 * Fills the buffer on the correct position for a pixel and color.
 * examples:
 * 0x3F = 00111111 first pixel of a byte black
 * 0xC0 = 11000000 first pixel of a byte white
 * 0xFC = 11111100 last pixel of a byte black
 * 0xFF = all pixels of a byte white
 * 0x00 = all pixels of a byte black

 * Overview
 * <ul>
 * <li>One byte in display buffer consists of 4 pixels, 2 bits per pixel.</li>
 * <li>First pixel starts left.</li>
 * <li>Each byte maps to 4 pixels on one X row.</li>
 * </ul>
 *
 * So how does it work?
 * <ol>
 * <li>Get the position of the pixel inside the byte (pos 0 - 3).</li>
 * <li>Calculate the target byte inside the buffer.</li>
 * <li>Update the buffer with bitmasks according to the colorbits.</li>
 * </ol>
 * @param {int} x - the x coordinate of a pixel
 * @param {int} y - the y coordinate of a pixel
 * @param {int} color - the color of a pixel, max 2 bits (color range is 0 - 3)
 */
var setPixel = function(x, y, color){
  // Get the pos of the pixel inside the ramXByte (pos 0 - 3).
  var xBytePos = (x % 4);
  console.log('xBytePos:' + xBytePos);
  // Calculate the target byte inside the buffer.
  // Formula (x+(y*maxX)) / 4  rounding down
  // what we want is :
  // x = 71, y = 0 = byteAddress 17
  // x = 0, y = 1 = byteAddress 18
  // so its (x + (y*xMax)) / 4
  var bufferAddress = ((x + (y*display.displaySizeX)) / 4) | 0;
  console.log('bufferAddress' + bufferAddress);
  // get the byte
  var byte = buffer[bufferAddress];
  // run 2 times
  for (i=1; i<3; i++){
    // color & i means, get the bit at position i
    if((color & i) !== 0) {
      // it is set, meaning it is not zero but 1
      // get the correct bitMask for the specific pixel and bit position
      // e.g. for the 2. pixel and the 2. Bit meaning bitmask value 16 00010000
      // apply bitwise OR
      byte |= bitMaskArray[pixelBitPosArray[xBytePos][2-i]];
    } else {
      // it is not set, meaning it is zero
      // apply bitwise AND but use the bitmask inverted (see tilde)
      byte &= ~bitMaskArray[pixelBitPosArray[xBytePos][2-i]];
    }
  }
  buffer[bufferAddress] = byte;
};

var fillWithZeroes = function(byte) {
  var byteAsString = byte.toString(2);
  byteAsString = '000000000'.substr(byteAsString.length) + byteAsString;
  return byteAsString
};

var testByte2 = 255; // all 4 pixels are white
var x = 1; // first pixel
var pixelBitPosArrayFirst = 0;
var pixelBitPosArraySecond = 1;
var color = 0; // black
//console.log('4 white pixels white: ' + fillWithZeroes(testByte2));
// logisches AND, allerdings ist mittels ~ tilde die bitmask invertiert,
// d.h. aus 128 = 10000000 wird 01111111 bzw. 127
// testByte 255 bzw. 11111111 wird AND verknüpft mit 01111111
//console.log('set first pixelbit: ' + fillWithZeroes(testByte2 &= ~128));
//console.log('set first pixelbit: ' + fillWithZeroes(testByte2 &= ~64));
//var number = 0;
//console.log(fillWithZeroes(number.toString(2)));
//number |=(1 << 0); // set the 1. bit
//console.log(fillWithZeroes(number.toString(2)));
var byte = 0;
byte |= (1 << 8);
//byte = byte + 0xff;
console.log(byte.toString(2));
