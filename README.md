# Practicas-DSD

## Como compilar:


Primero se realiza 
$ rpcgen -NCa dir.x

Luego se modifica el Makefile.dir:

CFLAGS += -g -I/usr/include/tirpc/
LDLIBS += -lnsl -ltirpc


-I/usr/include/tirpc/rpc/rpc.h
-ltirpc

(La primera linea solo hay que hacerla si se esta en una distribucion como Arch Linux)


Luego al compilarlo.

## Como se ejecuta
$ rpcbind
$ rpcinfo

Se ejecuta el programa del servidor y el del cliente de la siguiente forma: ./program localhost .

