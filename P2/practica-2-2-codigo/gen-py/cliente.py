from ast import match_case

from numpy import mat
from calculadora import Calculadora

from thrift import Thrift
from thrift.transport import TSocket
from thrift.transport import TTransport
from thrift.protocol import TBinaryProtocol

transport = TSocket.TSocket("localhost", 9090)
transport = TTransport.TBufferedTransport(transport)
protocol = TBinaryProtocol.TBinaryProtocol(transport)

client = Calculadora.Client(protocol)

transport.open()

SALIDA=20
NUM_OPCIONES=14

opcion=-1

while opcion!=SALIDA:
    opcion=-1   #Hace falta ponerlo de nuevo asi
    while((opcion<1 or opcion>NUM_OPCIONES) and opcion!=SALIDA):
        print("Calculadora, opciones: ")
        print("1.- Suma")
        print("2.- Resta")
        print("3.- Multiplicacion")
        print("4.- Division")
        print("5.- Raiz Cuadrada")
        print("6.- Modulo (primer_valor mod segundo valor)")
        print("7.- Potencia (primer_valor)^(segundo_valor)")
        print("8.- Comprobar si un numero es primo")
        print("9.- Factorial")
        print("10.- Suma matricial")
        print("11.- Resta matricial (sin implementar)")
        print("12.- Multiplicacion matricial")
        print("13.- Calculo de una cadena de operaciones respetando la jerarquia de operaciones")
        print("14.- Resolver ecuaciones de la forma ...=0")
        print(str(SALIDA)+".- Salir del programa")
        opcion=int(input("Introduzca la opcion: "))

        if((opcion<1 or opcion>NUM_OPCIONES) and opcion!=SALIDA):
            print("#########################")
            print("Opcion incorrecta")      
            print("#########################") 
    
    #Para los operadores binarios
    if(opcion==1 or opcion==2 or opcion==3 or opcion==4 or opcion==6 or opcion==7):
        v1=float(input("Introduzca el primer valor: "))
        v2=float(input("Introduzca el otro valor: "))
    
    elif (opcion==5 or opcion==8 or opcion==9):
        v1=float(input("Introduzca el valor: "))
    
    
    if(opcion==1):
        salida=client.suma(v1, v2)
    elif(opcion==2):
        salida=client.resta(v1, v2)
    elif(opcion==3):
        salida=client.mult(v1, v2)
    elif(opcion==4):
        salida=client.division(v1, v2)
    elif(opcion==5):
        salida=client.raiz_cuadrada(v1)
    elif(opcion==6):
        salida=client.modulo(v1, v2)
    elif(opcion==7):
        salida=client.potencia(v1, v2)
    elif(opcion==8):
        salida=client.es_primo(int(v1))
    elif(opcion==9):
        salida=client.factorial(v1)

    print("#######################################################")
    print("El resultado de la operacion es: "+str(salida))
    print("#######################################################")

transport.close()
