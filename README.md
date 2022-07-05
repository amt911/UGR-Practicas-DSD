# UGR-Practicas-DSD

Prácticas de la asignatura "Desarrollo de Sistemas Distribuidos" del grado en Ingeniería Informática en la especialidad "Ingeniería del Software".

Las prácticas están ordenadas en carpetas y contienen lo siguiente:

## P2
Contiene la implementación de una calculadora distribuida haciendo uso de Sun-RPC y Apache Thrift. Contiene la implementación básica, además de incluir ciertas operaciones interesantes.


### Sun-RPC
#### Cómo compilar:

Primero se realiza: ```$ rpcgen -NCa dir.x```

Luego se modifica el Makefile.calculadora:

```
CFLAGS += -g -I/usr/include/tirpc/
LDLIBS += -lnsl -ltirpc

-I/usr/include/tirpc/rpc/rpc.h
-ltirpc
```
Estas líneas se deben realizar si da error de compilación al no encontrar las cabeceras (por ejemplo, en distribuciones basadas en Arch Linux puede pasar)

Y por último: ```$ make -f Makefile.calculadora```

#### Cómo se ejecuta

```
$ sudo rpcbind
$ sudo rpcinfo
```

Se ejecuta el programa del servidor y el del cliente de la siguiente forma:

- **Servidor**: ```./program```
- **Cliente**: ```./program localhost```


### Apache Thrift
En esta parte he realizado el servidor en Python, mientras que el cliente está implementado en Java, Ruby y Python. Para la parte de Java es necesario tener los .jar necesarios (los adjunto en este repositorio) para que el programa pueda compilar, para Ruby es necesario tener las gemas instaladas, y para Python es necesario tener la biblioteca instalada.


## P3
En esta práctica se ha realizado un servidor replicado de donaciones haciendo uso de Java RMI. He implementado la funcionalidad básica, incluyendo el algoritmo de exclusión mutua en anillo, roles dentro del sistema, sistema básico de login, baneo de usuarios y capacidad de balancear un número arbitrario de réplicas.

## P4
En esta práctica se pedía hacer, mediante Node.js, Socket.io y el driver de MongoDB, un sistema de domótica con actuadores y sensores, los cuales dependiendo de valores, pueden saltar alertas. He implementado la funcionalidad básica, incluyendo más condiciones de alerta y de cambio automático de actuador. Además, he implementado la posibilidad de añadir/eliminar un número arbitrario de sensores, una simulación básica de los mismos, un chat grupal con login básico y una pizarra compartida al estilo de "Google Jamboard".
