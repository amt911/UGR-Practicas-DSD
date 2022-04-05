$:.unshift File.dirname(__FILE__)

require 'thrift'
require 'calculadora'

transport = Thrift::BufferedTransport.new(Thrift::Socket.new("localhost", 9090))
protocol = Thrift::BinaryProtocol.new(transport)
client = Calculadora::Client.new(protocol)

transport.open()

SALIDA=100
NUM_OPCIONES=16


def imprimir_matriz(m)
    for i in 0 ... m.size
        for j in 0 ... m[0].size
            print("#{m[i][j]} ")
        end
        print("\n")
    end
end

def rellenar_matriz(m)
	for i in 0 ... m.size
		print("Fila #{i} valores: ")

		for j in 0 ... m[0].size
			m[i][j]=gets.to_f
        end
    end
end


opcion=-1

while opcion!=SALIDA
    opcion=-1   #Hace falta ponerlo de nuevo asi
    while((opcion<1 or opcion>NUM_OPCIONES) and opcion!=SALIDA)
        print("Calculadora, opciones: \n")
        print("1.- Suma\n")
        print("2.- Resta\n")
        print("3.- Multiplicacion\n")
        print("4.- Division\n")
        print("5.- Raiz Cuadrada\n")
        print("6.- Modulo (primer_valor mod segundo valor)\n")
        print("7.- Potencia (primer_valor)^(segundo_valor)\n")
        print("8.- Comprobar si un numero es primo\n")
        print("9.- Factorial\n")
        print("10.- Suma matricial\n")
        print("11.- Resta matricial\n")
        print("12.- Multiplicacion matricial\n")
        print("13.- Traspuesta de una matriz\n")
        print("14.- Calculo de una cadena de operaciones respetando la jerarquia de operaciones\n")
        print("15.- Resolver ecuaciones de la forma ...=0\n")
        print("16.- Producto escalar de dos vectores\n")
        print("#{SALIDA}.- Salir del programa\n")
        print("Introduzca la opcion: ")
        opcion=gets.to_i

        if((opcion<1 or opcion>NUM_OPCIONES) and opcion!=SALIDA)
            print("#########################\n")
            print("Opcion incorrecta\n")      
            print("#########################\n") 
        end
    end
    
    #Para los operadores binarios
    if(opcion==1 or opcion==2 or opcion==3 or opcion==4 or opcion==6 or opcion==7)
        print("Introduzca el primer valor: ")
        v1=gets.to_f
        
        print("Introduzca el otro valor: ")
        v2=gets.to_f
    
    elsif (opcion==5 or opcion==8 or opcion==9)
        print("Introduzca el valor: ")
        v1=gets.to_f
    
    elsif(opcion==10 or opcion==11)
        print("Matriz num filas: ")
        fil=gets.to_i

        print("Matriz columnas: ")
        col=gets.to_i
        
        v1=Array.new(fil){Array.new(col)}
        v2=Array.new(fil){Array.new(col)}
    
        print("--------------------------------\n")
        
        print("Primera matriz: \n")
        rellenar_matriz(v1)
        
        print("--------------------------------\n")
        
        print("Segunda matriz: \n")
        rellenar_matriz(v2)
        
        print("-------------Operandos-------------------\n")
        
        print("Primera matriz: \n")
        imprimir_matriz(v1)
        
        print("--------------------------------\n")
        
        print("Segunda matriz: \n")
        imprimir_matriz(v2)
        
        print("--------------------------------\n");       
    
    elsif(opcion==12)
        print("Filas Matriz 1: ")
        fil=gets.to_i

        print("Columnas Matriz 1: ")
        col=gets.to_i
        
        v1=Array.new(fil){Array.new(col)}
        v2=Array.new(col){Array.new(fil)}
    
        print("--------------------------------\n")
        
        print("Primera matriz: \n")
        rellenar_matriz(v1)
        
        print("--------------------------------\n")
        
        print("Segunda matriz: \n")
        rellenar_matriz(v2)
        
        print("-------------Operandos-------------------\n")
        
        print("Primera matriz: \n")
        imprimir_matriz(v1)
        
        print("--------------------------------\n")
        
        print("Segunda matriz: \n")
        imprimir_matriz(v2)
        
        print("--------------------------------\n")
    
    elsif(opcion==13)
        print("Filas Matriz: ")
        fil=gets.to_i

        print("Columnas Matriz: ")
        col=gets.to_i
        
        v1=Array.new(fil){Array.new(col)}
    
        print("--------------------------------\n")
        
        print("Matriz: \n")
        rellenar_matriz(v1)
        
        print("-------------Operandos-------------------\n")
        
        print("Matriz: \n")
        imprimir_matriz(v1)
        
        print("--------------------------------\n")
        
    elsif(opcion==14)
        print("Introduzca expresion algebraica (c(): cos(), s(): sin(), t(): tan(), s(): sqrt(), e(): exp()): ")   
        v1=gets.chomp

    elsif(opcion==15)
        ("Introduzca ecuacion en funcion de x (c(): cos(), s(): sin(), t(): tan(), s(): sqrt(), e(): exp()): ")
        v1=gets.chomp

        print("Introduzca el error: ")
        error=gets.to_f
        
        print("Introduzca el extremo inferior del intervalo (donde se sospecha que puede estar la solucion): ")
        inf=gets.to_f

        print("Introduzca el extremo superior del intervalo (donde se sospecha que puede estar la solucion): ")
        sup=gets.to_f

    elsif(opcion==16)
        print("Numero de elementos de los vectores: ")
        col=gets.to_i
        
        v1=Array.new(1){Array.new(col)}
        v2=Array.new(col){Array.new(1)}
    
        print("--------------------------------\n")
        
        print("Primer vector: \n")
        rellenar_matriz(v1)
        
        print("--------------------------------\n")
        
        print("Segundo vector: \n")
        rellenar_matriz(v2)
        
        print("-------------Operandos-------------------\n")
        
        print("Primer vector: \n")
        imprimir_matriz(v1)
        
        print("--------------------------------\n")
        
        print("Segundo vector: \n")
        imprimir_matriz(v2)
        
        print("--------------------------------\n")        
    end

    if(1<=opcion and opcion<=NUM_OPCIONES)  
        if(opcion==1)
            salida=client.suma(v1, v2)
        elsif(opcion==2)
            salida=client.resta(v1, v2)
        elsif(opcion==3)
            salida=client.mult(v1, v2)
        elsif(opcion==4)
            salida=client.division(v1, v2)
        elsif(opcion==5)
            salida=client.raiz_cuadrada(v1)
        elsif(opcion==6)
            salida=client.modulo(v1.to_i, v2.to_i)
        elsif(opcion==7)
            salida=client.potencia(v1.to_i, v2.to_i)
        elsif(opcion==8)
            salida=client.es_primo(v1.to_i)
        elsif(opcion==9)
            salida=client.factorial(v1.to_i)
        elsif(opcion==10)
            salida=client.suma_matricial(v1, v2)
        elsif(opcion==11)
            salida=client.resta_matricial(v1, v2)
        elsif(opcion==12 or opcion==16)
            salida=client.mult_matricial(v1, v2)
        elsif(opcion==13)
            salida=client.traspuesta(v1)
        elsif(opcion==14)
            salida=client.multiples_comandos(v1, -1)
        elsif(opcion==15)
            salida=client.biseccion(v1, error, inf, sup)
        end
            
        if((1<=opcion and opcion<=9) or (14<=opcion and opcion<=15))
            print("#######################################################\n")
            print("El resultado de la operacion es: #{salida}\n")
            print("#######################################################\n")                
        
        elsif((10<=opcion and opcion<=13) or opcion==16)
            print("#######################################################\n")
            print("La operacion matricial/vectorial da como resultado: \n")
            imprimir_matriz(salida)
            print("#######################################################\n")
            
        else
            print("No deberia llegar aqui")
        end
    end
end

transport.close()
