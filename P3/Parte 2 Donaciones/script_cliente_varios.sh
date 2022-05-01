#!/bin/sh -e
# ejecutar = Macro para compilacion y ejecucion del programa ejemplo
# en una sola maquina Unix de nombre localhost.

if [[ "$#" -lt 2 ]] 
then
    echo "./script <numero de clientes> <variable-0-ó-1> [direccion-ip]"
    echo
    echo "Segundo argumento:"
    echo "  0: modo seguro"
    echo "  1: modo inseguro"
    echo
    echo "Tercer argumento (opcional): direccion IP"
    echo "Ejemplo para modo seguro con 2 clientes: ./script 2 0 localhost"
    echo "Ejemplo para modo inseguro con 3 clientes: ./script 3 1 localhost"
    echo "Fin del script"
    
    exit -1
elif [[ "$#" -lt 3 ]]
then
    dir=localhost

else
    dir=$3
fi

java -cp . -Djava.security.policy=server.policy Cliente/ClienteMainVarios $1 0 $2 $3 &
java -cp . -Djava.security.policy=server.policy Cliente/ClienteMainVarios $1 1 $2 $3 &