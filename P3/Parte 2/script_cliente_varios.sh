#!/bin/sh -e
# ejecutar = Macro para compilacion y ejecucion del programa ejemplo
# en una sola maquina Unix de nombre localhost.


for i in `seq 1 $1`
do
    java -cp . -Djava.security.policy=server.policy ClienteMainEntre $i &
    sleep 1
done