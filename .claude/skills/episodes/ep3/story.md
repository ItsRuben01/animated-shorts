# ep3 - Tu primer circuito con Arduino

## Guion
Niño: [curious] [excited] Papá, tú que eres ingeniero… [pause] ¿cómo puedo empezar a crear mis propios inventos?

Padre: [chuckles] [warm] Con el cerebro de miles de proyectos: una placa Arduino. Para dar vida a tu primer circuito solo necesitas cuatro piezas: un Arduino para dar la energía, un botón para dar la orden, una resistencia para proteger el sistema y un LED que nos mostrará el resultado. Primero conectamos la salida de cinco voltios al botón, que actuará como un puente levadizo. Al otro lado ponemos la resistencia de trescientos treinta ohmios para frenar el exceso de corriente y evitar que el LED se queme. Por último, cerramos el camino llevando el cable de vuelta a tierra. [whispering] [anticipation] Ahora llega el momento de la verdad. [excited] ¡Pulsa el botón! [amazed] Al presionarlo, el puente se cierra, la electricidad fluye sin peligro y… [pause] ¡magia!

Niño: [gasps] [laughs] ¡Guau! ¡Mira papá, se ha encendido!

Padre: [warm] No es solo una luz encendiéndose; es la primera vez que controlas la tecnología con tus propias manos.

## Nota técnica
- Circuito del guion: 5V → botón → 330 Ω → ánodo LED → cátodo → GND. Arduino actúa como fuente de energía en este montaje.
- Control digital real por pin requiere pin de salida (ej. 13), pinMode OUTPUT y digitalWrite HIGH/LOW.

## Fuentes
- https://docs.arduino.cc/tutorials/uno-rev3/board-anatomy
- https://docs.arduino.cc/tutorials/uno-rev3/intro-to-board
- https://docs.arduino.cc/built-in-examples/digital/Button
- https://docs.arduino.cc/tutorials/uno-rev3/Blink
- https://docs.arduino.cc/learn/starting-guide/getting-started-arduino
- https://resistorcolorcodes.com/330
