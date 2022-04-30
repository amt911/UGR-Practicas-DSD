#!/bin/sh -e
# ejecutar = Macro para compilacion y ejecucion del programa ejemplo
# en una sola maquina Unix de nombre localhost.
if [[ "$#" -lt 1 ]]
then
    var="localhost"
else
    var=$1
fi

java -cp . -Djava.security.policy=server.policy Cliente/ClienteMain $1