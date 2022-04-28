#!/bin/sh -e
# ejecutar = Macro para compilacion y ejecucion del programa ejemplo
# en una sola maquina Unix de nombre localhost.


#for i in `seq 1 $1`
#do
#    java -cp . -Djava.security.policy=server.policy Cliente/ClienteMainVarios $i &
#done

if [[ "$#" -ne 2 ]] 
then
    echo "./script <numero de clientes> <variable-entre-0-y-1>"
    echo "Segundo argumento:"
    echo "0: modo seguro"
    echo "1: modo inseguro"
    echo "Ejemplo para modo seguro con 2 clientes: ./script 2 0"
    echo "Ejemplo para modo inseguro con 3 clientes: ./script 3 1"
    echo "Fin del script"
else
java -cp . -Djava.security.policy=server.policy Cliente/ClienteMainVarios $1 0 $2 &
java -cp . -Djava.security.policy=server.policy Cliente/ClienteMainVarios $1 1 $2 &
fi