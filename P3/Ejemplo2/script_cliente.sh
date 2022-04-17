#!/bin/sh -e
# ejecutar = Macro para compilacion y ejecucion del programa ejemplo
# en una sola maquina Unix de nombre localhost.
echo
echo "Lanzando el primer cliente"
echo
java -cp . -Djava.security.policy=server.policy Cliente_Ejemplo_Multi_Threaded localhost $1

#echo
#echo "Lanzando el segundo cliente"
#echo
#java -cp . -Djava.security.policy=server.policy Cliente_Ejemplo_Multi_Threaded localhost $1