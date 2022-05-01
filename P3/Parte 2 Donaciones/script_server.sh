#!/bin/sh -e
# ejecutar = Macro para compilacion y ejecucion del programa ejemplo
# en una sola maquina Unix de nombre localhost.

rmiregistry &

if [[ "$#" -lt 1 ]]
then
    replicas=2
    var=localhost
elif [[ "$#" -eq 1 ]]
then
    replicas=$1
    var=localhost
else
    replicas=$1
    var=$2    
fi

echo
echo "Lanzando $replicas replicas con la direccion $var"
java -cp . -Djava.rmi.server.codebase=file:./ -Djava.rmi.server.hostname=$var -Djava.security.policy=server.policy Server/ServidorMain $replicas