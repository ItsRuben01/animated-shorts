# Episodio 2: Arduino, el botón y el LED

## Guion (~60 s, español, narrador único)

Un niño miraba un Arduino sobre la mesa.
Tenía una placa, un LED, un botón y cables.
Papá, ¿me ayudas a montarlo?
Su padre sonrió y le acercó la protoboard.
Primero, el botón. Cuatro patas, dos a cada lado.
Las dos de un lado siempre están unidas.
Las del otro lado se separan con la ranura central.
Una pata del botón va a tierra.
La otra va al pin dos.
Dentro de Arduino, un resistor mantiene el pin en alto.
Sin pulsar, digitalRead devuelve HIGH.
Al pulsar, el pin toca tierra y lee LOW.
Ahora el LED. La pata larga es el positivo.
Va al pin trece, con un resistor de doscientos veinte ohmios.
La pata corta va a tierra.
El resistor evita que el LED se queme.
El niño escribió tres líneas importantes.
pinMode dos, INPUT_PULLUP.
pinMode trece, salida.
Y digitalWrite trece al revés de lo que lee el botón.
Pulsó el botón. La luz se encendió.
Lo soltó. La luz se apagó.
No era magia. Era una pregunta y una respuesta.
El botón pregunta. Arduino responde con luz.

## Comprobación técnica

- Arduino Uno: entrada digital 2 con `INPUT_PULLUP`; botón entre el pin 2 y GND.
- LED: ánodo (pata larga) al pin 13 a través de 220 Ω; cátodo (pata corta) a GND.
- `digitalRead(2)` devuelve HIGH sin pulsar y LOW al pulsar.
- `digitalWrite(13, !digitalRead(2))` enciende el LED cuando el botón lee LOW y lo apaga cuando lee HIGH.
- Sin `INPUT_PULLUP`, `digitalWrite(13, digitalRead(2))` enciende con HIGH y apaga con LOW; aquí se usa la lógica invertida.

## Fuentes

| Comprobación | Fuente |
| --- | --- |
| Botón entre pin 2 y GND con `INPUT_PULLUP`: HIGH abierto, LOW pulsado; lógica invertida para encender el LED al pulsar. | [Arduino: Digital Input Pull-Up Resistor](https://docs.arduino.cc/tutorials/generic/digital-input-pullup/) |
| Cableado del botón con `pinMode(2, INPUT_PULLUP)` y lectura en el pin 2. | [Arduino: InputPullupSerial](https://docs.arduino.cc/built-in-examples/digital/InputPullupSerial) |
| LED externo: pata larga/ánodo al positivo, pata corta/cátodo a GND; resistor de 220 Ω limita la corriente. | [Arduino: Blink](https://docs.arduino.cc/built-in-examples/basics/Blink) |
| `digitalRead()` y `digitalWrite()` devuelven/escriben HIGH o LOW; `pinMode()` configura `INPUT_PULLUP` y `OUTPUT`. | [Arduino: Arduino API](https://docs.arduino.cc/learn/programming/reference) |
