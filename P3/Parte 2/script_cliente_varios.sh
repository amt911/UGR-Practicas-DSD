#!/bin/sh -e
# ejecutar = Macro para compilacion y ejecucion del programa ejemplo
# en una sola maquina Unix de nombre localhost.

java -cp . -Djava.security.policy=server.policy ClienteMainEntre 1 &
java -cp . -Djava.security.policy=server.policy ClienteMainEntre 2 &
java -cp . -Djava.security.policy=server.policy ClienteMainEntre 3 &
java -cp . -Djava.security.policy=server.policy ClienteMainEntre 4 &
java -cp . -Djava.security.policy=server.policy ClienteMainEntre 5 &
java -cp . -Djava.security.policy=server.policy ClienteMainEntre 6 &
java -cp . -Djava.security.policy=server.policy ClienteMainEntre 7 &
java -cp . -Djava.security.policy=server.policy ClienteMainEntre 8 &
