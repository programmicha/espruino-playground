# Espruino: Notizen

## Zustand des Gerätes sichern

Damit Code auch nach disconnect bzw. lösen der USB Verbindung erhalten bleibt muss einmal ```save();``` auf dem Espruino ausgeführt werden.

## Zustand zurücksetzen

Mit ```reset();``` und danach ein ```save();``` setzt auch vorhandenen Code zurück.

## ESP8266

Variante:

* Pico direkt via USB an Laptop
* Pico mit ESP8266 verbunden via
    * GND -> GND
    * 3.3v -> VCC
    * B6 -> TX
    * B7 -> RX
Bringt immerhin schonmal die rote LED des ESP8266 zum Leuchten.

Der Code zum Test von [http://www.espruino.com/ESP8266](http://www.espruino.com/ESP8266) lässt zwar die blaue LED des ESP8266 blinken, aber das erwartete Ergebnis (Firmware Versionsnummer) kommt nicht stattdessen:

```
""
""
""
Done!
```

Nochmal mit den vorgeschlagenen capacitors (Kondensatoren) für die GND und VCC Verbindung probieren und dann nochmal den CH_PD Pin des ESB8266 mit 3.3v versorgen.





    