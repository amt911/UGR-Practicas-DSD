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

SALIDA=100
NUM_OPCIONES=16


def imprimir_matriz(m):
    for i in range(len(m)):
        for j in range(len(m[0])):
            print(str(m[i][j])+" ", end="")
            
        print("\n")

def rellenar_matriz(m):
	for i in range(len(m)):
		print("Fila "+str(i)+" valores: ")
		for j in range(len(m[0])):
			m[i][j]=float(input(""))


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
        print("11.- Resta matricial")
        print("12.- Multiplicacion matricial")
        print("13.- Traspuesta de una matriz")
        print("14.- Calculo de una cadena de operaciones respetando la jerarquia de operaciones")
        print("15.- Resolver ecuaciones de la forma ...=0")
        print("16.- Producto escalar de dos vectores")
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
    
    elif(opcion==10 or opcion==11):
    
        fil=int(input("Matriz num filas: "))
        col=int(input("Matriz columnas: "))
        
        v1=[[0 for j in range(col)] for i in range(fil)]
        v2=[[0 for j in range(col)] for i in range(fil)]
    
        print("--------------------------------")
        
        print("Primera matriz: ")
        rellenar_matriz(v1)
        
        print("--------------------------------")
        
        print("Segunda matriz: ")
        rellenar_matriz(v2)
        
        print("-------------Operandos-------------------")
        
        print("Primera matriz: ")
        imprimir_matriz(v1)
        
        print("--------------------------------")
        
        print("Segunda matriz: ")
        imprimir_matriz(v2)
        
        print("--------------------------------");       
    
    elif(opcion==12):
        fil=int(input("Filas Matriz 1: "))
        col=int(input("Columnas Matriz 1: "))
        
        v1=[[0 for j in range(col)] for i in range(fil)]
        v2=[[0 for j in range(fil)] for i in range(col)]
    
        print("--------------------------------")
        
        print("Primera matriz: ")
        rellenar_matriz(v1)
        
        print("--------------------------------")
        
        print("Segunda matriz: ")
        rellenar_matriz(v2)
        
        print("-------------Operandos-------------------")
        
        print("Primera matriz: ")
        imprimir_matriz(v1)
        
        print("--------------------------------")
        
        print("Segunda matriz: ")
        imprimir_matriz(v2)
        
        print("--------------------------------")
    
    elif(opcion==13):
        fil=int(input("Filas Matriz: "))
        col=int(input("Columnas Matriz: "))
        
        v1=[[0 for j in range(col)] for i in range(fil)]
    
        print("--------------------------------")
        
        print("Matriz: ")
        rellenar_matriz(v1)
        
        print("-------------Operandos-------------------")
        
        print("Matriz: ")
        imprimir_matriz(v1)
        
        print("--------------------------------")
        
    elif(opcion==14):
        v1=input("Introduzca expresion algebraica (c(): cos(), s(): sin(), t(): tan(), s(): sqrt(), e(): exp()): ")   

    elif(opcion==15):
        v1=input("Introduzca ecuacion en funcion de x (c(): cos(), s(): sin(), t(): tan(), s(): sqrt(), e(): exp()): ")
        error=float(input("Introduzca el error: "))
        
        inf=float(input("Introduzca el extremo inferior del intervalo (donde se sospecha que puede estar la solucion): "))
        sup=float(input("Introduzca el extremo superior del intervalo (donde se sospecha que puede estar la solucion): "))
    
    elif(opcion==16):
        col=int(input("Numero de elementos de los vectores: "))
        
        v1=[[0 for j in range(col)] for i in range(1)]
        v2=[[0 for j in range(1)] for i in range(col)]
    
        print("--------------------------------")
        
        print("Primer vector: ")
        rellenar_matriz(v1)
        
        print("--------------------------------")
        
        print("Segundo vector: ")
        rellenar_matriz(v2)
        
        print("-------------Operandos-------------------")
        
        print("Primer vector: ")
        imprimir_matriz(v1)
        
        print("--------------------------------")
        
        print("Segundo vector: ")
        imprimir_matriz(v2)
        
        print("--------------------------------")
    
    
    if(1<=opcion<=NUM_OPCIONES):  
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
            salida=client.modulo(int(v1), int(v2))
        elif(opcion==7):
            salida=client.potencia(int(v1), int(v2))
        elif(opcion==8):
            salida=client.es_primo(int(v1))
        elif(opcion==9):
            salida=client.factorial(int(v1))
        elif(opcion==10):
            salida=client.suma_matricial(v1, v2)
        elif(opcion==11):
            salida=client.resta_matricial(v1, v2)
        elif(opcion==12 or opcion==16):
            salida=client.mult_matricial(v1, v2)
        elif(opcion==13):
            salida=client.traspuesta(v1)
        elif(opcion==14):
            salida=client.multiples_comandos(v1, -1)
        elif(opcion==15):
            salida=client.biseccion(v1, error, inf, sup)
            
        if(1<=opcion<=10 or 14<=opcion<=15):
            print("#######################################################")
            print("El resultado de la operacion es: "+str(salida))
            print("#######################################################")                
        
        elif(10<=opcion<=13 or opcion==16):
            print("#######################################################")
            print("La operacion matricial da como resultado: ")
            imprimir_matriz(salida)
            print("#######################################################")
            
        else:
            print("placeholder")

transport.close()
