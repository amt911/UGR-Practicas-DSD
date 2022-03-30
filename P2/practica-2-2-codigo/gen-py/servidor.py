import glob
import sys
import this

from calculadora import Calculadora

from thrift.transport import TSocket
from thrift.transport import TTransport
from thrift.protocol import TBinaryProtocol
from thrift.server import TServer

import logging

logging.basicConfig(level=logging.DEBUG)

import math
class CalculadoraHandler:
    def __init__(self):
        self.log = {}

    def suma(self, num1, num2):
        return num1+num2
   
    def resta(self, num1,  num2):
        return num1-num2
   
    def mult(self, a,  b):
        return a*b
    
    def division(self, a,  b):
        return a/b
    
    def modulo(self, dividendo,  divisor):
        return dividendo%divisor
    
    def raiz_cuadrada(self, a):
        return math.sqrt(a)
    
    def logaritmo(self, a,  b):
        return "No implementado"
    
    def es_primo(self, a):
        res=True

        for i in range(2, int((a/2)+1)):
            if(a%i==0):
                res=False

        return res
    
    
        
    def potencia(self, base,  exp):
        return base**exp
    
    def factorial(self, a):
        res=1
        for i in range(1, a+1):
            res*=i
            
        return res
        

    def suma_matricial(self, a,  b):
        res=[[0 for j in range(len(a[0]))] for i in range(len(a))]
        
        for i in range(len(a)):
            for j in range(len(a[0])):
                res[i][j]=a[i][j]+b[i][j]
        
        return res
        
        
        
    def resta_matricial(self, a,  b):
        res=[[0 for j in range(len(a[0]))] for i in range(len(a))]
        
        for i in range(len(a)):
            for j in range(len(a[0])):
                res[i][j]=a[i][j]-b[i][j]
        
        return res
            

    def mult_matricial(self, a,  b):
        res=[[0 for j in range(len(b[0]))] for i in range(len(a))]
        
        for i in range(len(a)):
            for j in range(len(b[0])):
                for k in range(len(a[0])):
                    res[i][j]+=a[i][k]*b[k][j]
                    
        return res

    def multiples_comandos(self, cadena, x):
        salida, operadores = [], []  # No hace falta un contador

	#Falla con: -r(6.3245/67567*8^2)-s(9.7554-3)+c(-9) (tiene que dar: -1.443389)
	#Tambien con: -s(2345.5435/908^23)/(-2-3)-r(67*9.4321/3)*-2 (tiene que dar: 29.02758)
	#Tambien con: 3*-2 -> 3*0-2 ESTA MAL
	# -c(96*5*-r(6^2))/5+7		Tiene que dar: 7.133423546
	# -(9-10)
	# -s(-(3-7))		Tiene que dar: 0.7568

        prioridades = {
            'E': 3,
            'R': 3,
            'S': 3,
            'C': 3,
            'e': 3,
            'r': 3,
            's': 3,
            'c': 3,
            '^': 3,
            '*': 2,
            '/': 2,
            '+': 1,
            '-': 1
        }

        i = 0

		#Se crea una lista con la cadena ya que en Python los strings son inmutables
        cadena_list=list(cadena)
  
        while(i < len(cadena_list)):
            #Si es el operador - unario
            if(cadena_list[i] == '-' and (((i-1) >= 0 and (cadena_list[i-1] < '0' or cadena_list[i-1] > '9') and (cadena_list[i-1] != ')')) or i == 0)):
                if('0' <= cadena_list[i+1] <= '9'):
                    # Inserto caracter especial para los - unarios
                    salida.append('u')

                elif(cadena_list[i+1] == '('):
                    #Si hay algo del tipo: -(9-8) se convierte a -1*(9-8)
                    salida.append('u')  # Se mete el - unario
                    salida.append('1')  # Se mete el 1
                    # Se convierte ese - unario de la entrada por un * para que lo detecte como multiplicacion
                    cadena_list[i] = '*'
                    i -= 1

                else:	#-r(5^2)-s(-5-8)
                    # Si es una funcion se le cambia el estado a negativo
                    cadena_list[i+1] = cadena_list[i+1].upper()
                    

            elif(cadena_list[i] == '+' or cadena_list[i] == '-' or cadena_list[i] == '*' or cadena_list[i] == '/' or cadena_list[i] == '^'):
                # Caracter especial para detectar numeros con mas de una cifra
                salida.append('|')
                while(len(operadores) > 0 and operadores[-1] != '(' and ((prioridades[operadores[-1]] > prioridades[cadena_list[i]]) or (prioridades[operadores[-1]] == prioridades[cadena_list[i]] and prioridades[cadena_list[i]] != '^'))):
                    salida.append(operadores.pop())

                operadores.append(cadena_list[i])

            elif(cadena_list[i] == '('):
                # Caracter especial para detectar numeros con mas de una cifra
                salida.append('|')
                operadores.append(cadena_list[i])

            elif(cadena_list[i] == ')'):
                # Caracter especial para detectar numeros con mas de una cifra
                salida.append('|')

                while(operadores[-1] != '('):
                    assert(len(operadores) > 0)
                    salida.append(operadores.pop())

                assert(operadores[-1] == '(')
                operadores.pop()

            elif(('0' <= cadena_list[i] <= '9') or cadena_list[i] == '.' or cadena_list[i] == 'x'):
                salida.append(cadena_list[i])

            else:
                # Caracter especial para detectar numeros con mas de una cifra
                salida.append('|')
                operadores.append(cadena_list[i])

            i += 1


        if(len(operadores) > 0):  # Si todavia quedan operadores se pone un | para diferenciarlos
            salida.append('|')


        while(len(operadores) > 0):
            salida.append(operadores.pop())


        print("Salida postfijo: ", end='')
        #for i in range(len(salida)):
        print(*salida, sep='')


	    #Fase de calcular el propio valor especificado
        calculo=[]
        i=0
        es_negativo=False

        while( i<len(salida)):
            if(salida[i]=='+' or salida[i]=='-' or salida[i]=='*' or salida[i]=='/' or salida[i]=='^'):
                assert(len(calculo)>=2);
                aux2=calculo.pop();
                aux1=calculo.pop();

                if(salida[i]=='+'):
                    calculo.append(aux1+aux2)
				

                elif(salida[i]=='-'):
                    calculo.append(aux1-aux2)
                
                
                elif(salida[i]=='*'):
                    calculo.append(aux1*aux2)
                
                
                elif(salida[i]=='/'):
                    calculo.append(aux1/aux2)
                
                
                elif(salida[i]=='^'):
                    calculo.append(aux1**aux2);

            elif(('0'<=salida[i]<='9') or salida[i]=='u'):
                if(salida[i]=='u'):
                    es_negativo=True
                    i+=1
                
                res_float=[]
                #Implementacion unica de Python
                while(salida[i]!='|'):
                    res_float.append(salida[i])
                    i+=1
                
                
                #IMPORTANTE COMPROBAR ESTA SECCION
                calculo.append(float(''.join(res_float)))

                if(es_negativo):
                    calculo[-1]=-calculo[-1]
                    es_negativo=False


            elif(salida[i]=='x'):
                calculo.append(x)

            elif(salida[i].lower() =='s' or salida[i].lower()=='c' or salida[i].lower()=='t' or salida[i].lower()=='r' or salida[i].lower()=='e'):
                assert(len(calculo)>=1)

                minuscula=salida[i].lower()

                if(minuscula=='s'):
                    aux1=math.sin(calculo.pop())

                elif(minuscula=='c'):
                    aux1=math.cos(calculo.pop())

                elif(minuscula=='t'):
                    aux1=math.tan(calculo.pop())

                elif(minuscula=='r'):
                    aux1=math.sqrt(calculo.pop())

                elif(minuscula=='e'):
                    aux1=math.exp(calculo.pop())

                calculo.append(aux1)

                if('A'<=salida[i]<='Z'):
                    calculo[-1]=-calculo[-1]
            
            i+=1
            
        return calculo[-1]
      
    
    def traspuesta(self, a):
        res=[[0 for j in range(len(a[0]))] for i in range(len(a))]
        
        for i in range(len(a)):
            for j in range(len(a[0])):
                res[j][i]=a[i][j]
                
        return res
'''
    def determinante_matriz(self, a):
    def resolver_ecuaciones(self, cadena,  eq):
    
'''



if __name__ == "__main__":
    handler = CalculadoraHandler()
    processor = Calculadora.Processor(handler)
    transport = TSocket.TServerSocket(host="127.0.0.1", port=9090)
    tfactory = TTransport.TBufferedTransportFactory()
    pfactory = TBinaryProtocol.TBinaryProtocolFactory()

    server = TServer.TSimpleServer(processor, transport, tfactory, pfactory)

    print("iniciando servidor...")
    server.serve()
    print("fin")
