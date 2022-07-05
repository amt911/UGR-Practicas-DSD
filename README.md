# UGR-Practicas-DSD

Prácticas de la asignatura "Desarrollo de Sistemas Distribuidos" del grado en Ingeniería Informática en la especialidad "Ingeniería del Software".

Las prácticas están ordenadas en carpetas y contienen lo siguiente:

## P2
Contiene la implementación de una calculadora distribuida haciendo uso de Sun-RPC. Contiene la implementación básica, además de incluir ciertas operaciones interesantes.

### Cómo compilar:

Primero se realiza: ```$ rpcgen -NCa dir.x```

Luego se modifica el Makefile.dir:

```
CFLAGS += -g -I/usr/include/tirpc/
LDLIBS += -lnsl -ltirpc

-I/usr/include/tirpc/rpc/rpc.h
-ltirpc
```
Estas líneas se deben realizar si da error de compilación al no encontrar las cabeceras (por ejemplo, en distribuciones basadas en Arch Linux puede pasar)

Y por último: ```$ make -f Makefile.dir```

### Cómo se ejecuta

```
$ sudo rpcbind
$ sudo rpcinfo
```

Se ejecuta el programa del servidor y el del cliente de la siguiente forma:

- **Servidor**: ```./program localhost .```
- **Cliente**: ```./program```
