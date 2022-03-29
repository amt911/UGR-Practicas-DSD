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


    def multiples_comandos(self, cadena):
        salida, operadores=[], []       #No hace falta un contador
        
        prioridades={
            'E':3,
            'R':3,
            'S':3,
            'C':3,
            'e':3,
            'r':3,
            's':3,
            'c':3,
            '^':3,
            '*':2,
            '/':2,
            '+':1,
            '-':1
        }
    
        i=0
        
        while(cadena[i]<len(cadena)):
            #Si es el operador - unario
            if(cadena[i]=='-' and (((i-1)>=0 and (cadena[i-1]<'0' or cadena[i-1]>'9') and (cadena[i-1]!=')')) or i==0)):
                if('0'<=cadena[i+1]<='9'):
                    salida.push('u')	#Inserto caracter especial para los - unarios

                elif(cadena[i+1]=='('):
                    #Si hay algo del tipo: -(9-8) se convierte a -1*(9-8)
                    salida.push('u')	#Se mete el - unario
                    salida.push('1')	#Se mete el 1
                    cadena[i]='*'	#Se convierte ese - unario de la entrada por un * para que lo detecte como multiplicacion
                    i-=1
        
                else:
                    cadena[i+1]=cadena[i+1].upper()	#Si es una funcion se le cambia el estado a negativo

            elif(cadena[i]=='+' or cadena[i]=='-' or cadena[i]=='*' or cadena[i]=='/' or cadena[i]=='^'):
                salida.push('|')		#Caracter especial para detectar numeros con mas de una cifra
                while(operadores.top()!='(' and ((prioridades[operadores.top()]>prioridades[cadena[i]]) or (prioridades[operadores.top()]==prioridades[cadena[i]] and prioridades[cadena[i]]!='^'))):
                    salida.push(operadores.pop())

                operadores.push(cadena[i])

            elif(cadena[i]=='('):
                salida.push('|')		#Caracter especial para detectar numeros con mas de una cifra
                operadores.push(cadena[i])			

            elif(cadena[i]==')'):
                salida.push('|')		#Caracter especial para detectar numeros con mas de una cifra
                
                while(operadores.top()!='('):
                    assert(not operadores.empty())
                    salida.push(operadores.pop())

                assert(operadores.top()=='(')
                operadores.pop()

            elif(('0'<=cadena[i]<='9') or cadena[i]=='.' or cadena[i]=='x'):
                salida.push(cadena[i])

            else:
                salida.push('|')		#Caracter especial para detectar numeros con mas de una cifra
                operadores.push(cadena[i])

            i+=1
        
        if(not operadores.empty()):		#Si todavia quedan operadores se pone un | para diferenciarlos
            salida.push('|')

        #for(int i=contOperadores; i>0; i--)
        while(not operadores.empty()):
            salida.push(operadores.pop())

        #salida[contSalida++]='\0';

        print("Salida postfijo: "+salida)
'''
	//Se aplica el algoritmo de shunting yard de Dijkstra para pasar a la forma postfijo
	char salida[1000], operadores[1000];
	int contSalida=0, contOperadores=0;
	char prioridades[]={'E', 'R', 'S', 'C', 'e', 'r', 's', 'c', '^', '*', '/', '+', '-'};	//Sirven para buscar luego la prioridad en el array de abajo (cuanto mas alto mas prioritario)
	int prioridadesValor[]={3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 1, 1};	//Indica la prioridad de la operacion
	int i=0;

	//Falla con: -r(6.3245/67567*8^2)-s(9.7554-3)+c(-9) (tiene que dar: -1.443389)
	//Tambien con: -s(2345.5435/908^23)/(-2-3)-r(67*9.4321/3)*-2 (tiene que dar: 29.02758)
	//Tambien con: 3*-2 -> 3*0-2 ESTA MAL
	// -c(96*5*-r(6^2))/5+7		Tiene que dar: 7.133423546
	// -(9-10)
	// -s(-(3-7))		Tiene que dar: 0.7568

	while(arg1[i]!='\0'){
		//Si es el operador - unario
		if(arg1[i]=='-' && (((i-1)>=0 && (arg1[i-1]<'0' || arg1[i-1]>'9') && (arg1[i-1]!=')')) || i==0)){
			if(arg1[i+1]>='0' && arg1[i+1]<='9')
				salida[contSalida++]='u';	//Inserto caracter especial para los - unarios

			else if(arg1[i+1]=='('){
				//Si hay algo del tipo: -(9-8) se convierte a -1*(9-8)

				salida[contSalida++]='u';	//Se mete el - unario
				salida[contSalida++]='1';	//Se mete el 1
				arg1[i--]='*';	//Se convierte ese - unario de la entrada por un * para que lo detecte como multiplicacion
			}
			else{
				arg1[i+1]=toupper(arg1[i+1]);	//SI es una funcion se le cambia el estado a negativo
			}
		}

		else if(arg1[i]=='+' || arg1[i]=='-' || arg1[i]=='*' || arg1[i]=='/' || arg1[i]=='^'){
			salida[contSalida++]='|';		//Caracter especial para detectar numeros con mas de una cifra
			while(contOperadores>0 && operadores[contOperadores-1]!='(' && ((prioridadesValor[strchr(prioridades, operadores[contOperadores-1])-prioridades]>prioridadesValor[strchr(prioridades, arg1[i])-prioridades]) || (prioridadesValor[strchr(prioridades, operadores[contOperadores-1])-prioridades]==prioridadesValor[strchr(prioridades, arg1[i])-prioridades] && prioridades[strchr(prioridades, arg1[i])-prioridades]!='^'))){
				salida[contSalida++]=operadores[--contOperadores];
			}

			operadores[contOperadores++]=arg1[i];
		}

		else if(arg1[i]=='('){
			salida[contSalida++]='|';		//Caracter especial para detectar numeros con mas de una cifra
			operadores[contOperadores++]=arg1[i];			
		}
		else if(arg1[i]==')'){
			salida[contSalida++]='|';		//Caracter especial para detectar numeros con mas de una cifra
			
			while(operadores[contOperadores-1]!='('){
				assert(contOperadores>0);
				salida[contSalida++]=operadores[--contOperadores];
			}

			assert(operadores[contOperadores-1]=='(');
			contOperadores--;			
		}
		else if((arg1[i]>='0' && arg1[i]<='9') || arg1[i]=='.' || arg1[i]=='x'){
			salida[contSalida++]=arg1[i];
		}
		else{
			salida[contSalida++]='|';		//Caracter especial para detectar numeros con mas de una cifra
			operadores[contOperadores++]=arg1[i];
		}

		i++;
	}
	
	if(contOperadores>0)		//Si todavia quedan operadores se pone un | para diferenciarlos
		salida[contSalida++]='|';

	for(int i=contOperadores; i>0; i--)
		salida[contSalida++]=operadores[i-1];

	salida[contSalida++]='\0';

	printf("Salida postfijo: %s\n", salida);


	//Fase de calcular el propio valor especificado
	double calculo[1000], aux1, aux2;
	int contCalculo=0;
	i=0;

	while( salida[i]!='\0'){
		if(salida[i]=='+' || salida[i]=='-' || salida[i]=='*' || salida[i]=='/' || salida[i]=='^'){
			assert(contCalculo>=2);
			aux2=calculo[--contCalculo];
			aux1=calculo[--contCalculo];

			switch(salida[i]){
				case '+':
				calculo[contCalculo++]=aux1+aux2;
				break;

				case '-':
				calculo[contCalculo++]=aux1-aux2;
				break;

				case '*':
				calculo[contCalculo++]=aux1*aux2;
				break;

				case '/':
				calculo[contCalculo++]=aux1/aux2;
				break;

				case '^':
				calculo[contCalculo++]=pow(aux1, aux2);
				break;
			}			
		}

		else if((salida[i]>='0' && salida[i]<='9') || salida[i]=='u'){
			if(salida[i]=='u')
				i++;
			
			calculo[contCalculo++]=atof(&salida[i]);

			if(salida[i-1]=='u')
				calculo[contCalculo-1]=-calculo[contCalculo-1];
			
			if(salida[i+1]!='|'){	//Nos encontramos ante un numero mayor que 10 o decimal
				for(int j=i; j<contSalida && salida[j]!='|'; j++){
					i=j;
				}
			}						
		}
		else if(salida[i]=='x')
			calculo[contCalculo++]=x;

		else if(tolower(salida[i])=='s' || tolower(salida[i])=='c' || tolower(salida[i])=='t' || tolower(salida[i])=='r' || tolower(salida[i])=='e'){
			assert(contCalculo>=1);

			switch(tolower(salida[i])){
				case 's':{	//sin
					aux1=sin(calculo[--contCalculo]);
					break;
				}

				case 'c':{	//cos
					aux1=cos(calculo[--contCalculo]);
					break;
				}

				case 't':{	//tan
					aux1=tan(calculo[--contCalculo]);
					break;				
				}

				case 'r':{		//sqrt
					aux1=sqrt(calculo[--contCalculo]);
					break;							
				}

				case 'e':{	//Para las exponenciales con el numero e
					aux1=exp(calculo[--contCalculo]);
					break;											
				}						
			}

			calculo[contCalculo++]=aux1;

			if(salida[i]>='A' && salida[i]<='Z'){
				calculo[contCalculo-1]=-calculo[contCalculo-1];
			}
		}

		i++;
	}

	result=calculo[0];
'''        
    
'''
    def traspuesta(self, a):
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
