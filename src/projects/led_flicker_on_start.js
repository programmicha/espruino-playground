/*
Aktiviert beide LEDs, deaktiviert die rote LED nach 1s und die grüne LED nach 2s.

onInit(); wird vom Gerät dauerhaft ausgeführt, 
dazu muss aber auch der Zustand mittels save(); gesichert werden.
*/
function onInit() {
  digitalWrite([LED1,LED2], 2); // entspricht 11 also 2x on
  setTimeout(digitalWrite, 1000, [LED1,LED2], 1); // entspricht 01, also einmal aus und einmal an
  // anderer coding style, sozusagen inline function und parameters
  setTimeout("digitalWrite([LED1,LED2], 0);", 2000); // entspricht 0, wobei  beide Pins die 0 bekommen
}