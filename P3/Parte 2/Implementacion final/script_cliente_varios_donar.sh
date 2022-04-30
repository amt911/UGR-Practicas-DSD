#!/bin/sh -e
# ejecutar = Macro para compilacion y ejecucion del programa ejemplo
# en una sola maquina Unix de nombre localhost.

if [[ "$#" -ne 1 ]] 
then
    echo "./script <numero de clientes>"
    echo "Ejemplo para 2 clientes: ./script 2"
    echo "Ejemplo para 3 clientes: ./script 3"
    echo "Fin del script"
else
    for i in `seq 0 $(($1-1))`
    do
        java -cp . -Djava.security.policy=server.policy Cliente/ClienteMainVariosDonar $i &
    done
fi