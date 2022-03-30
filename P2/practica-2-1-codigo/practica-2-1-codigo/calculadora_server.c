/*
 * This is sample code generated by rpcgen.
 * These are only templates and you can use them
 * as a guideline for developing your own functions.
 */

#include "calculadora.h"
#include <math.h>
#include <string.h>
#include <assert.h>
#include <ctype.h>

double *
suma_1_svc(double arg1, double arg2,  struct svc_req *rqstp)
{
	static double  result;
	result=arg1+arg2;

	return &result;
}

double *
resta_1_svc(double arg1, double arg2,  struct svc_req *rqstp)
{
	static double  result;
	result=arg1-arg2;


	return &result;
}

double *
mult_1_svc(double arg1, double arg2,  struct svc_req *rqstp)
{
	static double  result;
	result=arg1*arg2;

	return &result;
}

double *
division_1_svc(double arg1, double arg2,  struct svc_req *rqstp)
{
	static double  result;
	result=arg1/arg2;


	return &result;
}

int *
modulo_1_svc(int arg1, int arg2,  struct svc_req *rqstp)
{
	static int  result;
	result=arg1%arg2;


	return &result;
}

double *		//Un poco mejorable
raizcuadrada_1_svc(double arg1,  struct svc_req *rqstp)
{
	static double  result;

	result=sqrt(arg1);

	return &result;
}

double *		//Puede que no lo haga
logaritmo_1_svc(int arg1, int arg2,  struct svc_req *rqstp)
{
	static double  result;

	/*
	 * insert server code here
	 */

	return &result;
}

int *
esprimo_1_svc(int arg1,  struct svc_req *rqstp)
{
	static int  result;

	result=1;

	for(int i=2; i<=arg1/2; i++)
		if(arg1%i==0)
			result=0;

	return &result;
}

int *
potencia_1_svc(int arg1, int arg2,  struct svc_req *rqstp)
{
	static int  result;

	result=1;

	for(int i=0; i<arg2; i++)
		result*=arg1;


	return &result;
}

int *
factorial_1_svc(int arg1,  struct svc_req *rqstp)
{
	static int  result;

	result=1;

	for(int i=1; i<=arg1 && result!=-1; i++){
		if(i>(INT_MAX/result)){		//En caso de que haya overflow se pone a -1 y se sale
			result=-1;
		}
		else
			result*=i;
	}

	return &result;
}

matrix *
sumamatricial_1_svc(matrix arg1, matrix arg2,  struct svc_req *rqstp)
{
	static matrix  result;

	xdr_free((xdrproc_t)xdr_double, result.m.m_val);
	result.m.m_len=0;

	result.fil=arg1.fil;
	result.col=arg1.col;

	result.m.m_val=calloc(result.fil*result.col, sizeof(double));
	result.m.m_len=result.fil*result.col;

	for(int i=0; i<arg1.fil; i++)
		for(int j=0; j<arg1.col; j++)
			result.m.m_val[i*result.col+j]=arg1.m.m_val[i*result.col+j]+arg2.m.m_val[i*result.col+j];

	return &result;
}

matrix *
multmatricial_1_svc(matrix arg1, matrix arg2,  struct svc_req *rqstp)
{
	static matrix  result;
	xdr_free((xdrproc_t)xdr_double, result.m.m_val);
	result.m.m_len=0;

	result.fil=arg1.fil;
	result.col=arg2.col;

	result.m.m_val=calloc(result.fil*result.col, sizeof(double));
	result.m.m_len=result.fil*result.col;

	//Supuestamente la ventaja de calloc es que inicializa la seccion de memoria almacenada
	//Sin embargo yo lo vuelvo a inicializar

	for(int i=0; i<result.fil; i++)
		for(int j=0; j<result.col; j++)
			result.m.m_val[i*result.col+j]=0;

	for(int i=0; i<arg1.fil; i++)
		for(int j=0; j<arg2.col; j++)
			for(int k=0; k<arg1.col; k++)
				result.m.m_val[i*result.col+j]+=arg1.m.m_val[i*arg1.col+k]*arg2.m.m_val[k*arg2.col+j];

	return &result;
}

matrix *
traspuesta_1_svc(matrix arg1,  struct svc_req *rqstp)
{
	static matrix  result;
	xdr_free((xdrproc_t)xdr_double, result.m.m_val);
	result.m.m_len=0;

	result.fil=arg1.fil;
	result.col=arg1.col;

	result.m.m_val=calloc(result.fil*result.col, sizeof(double));
	result.m.m_len=result.fil*result.col;	

	for(int i=0; i<result.fil; i++)
		for(int j=0; j<result.col; j++)
			result.m.m_val[j*result.col+i]=arg1.m.m_val[i*result.col+j];

	return &result;
}

double *
determinantematriz_1_svc(matrix arg1,  struct svc_req *rqstp)
{
	static double  result;

	/*
	 * insert server code here
	 */

	return &result;
}

double operacionAlgebraicaShuntingYard(char *arg1, double x)
{
	//Se aplica el algoritmo de shunting yard de Dijkstra para pasar a la forma postfijo
	double  result;
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

	return result;
}

double *
resolverecuaciones_1_svc(char *ecuacion, double error, struct svc_req *rqstp)
{
	static double  result;

	double a=-300, b=300;
	unsigned char encontrado=0;

	for(int i=0; i<100 && !encontrado; i++){
		if(operacionAlgebraicaShuntingYard(ecuacion, a)*operacionAlgebraicaShuntingYard(ecuacion, b)>=0){		//Por Bolzano
			a-=300;
			b+=300;
		}
		else
			encontrado=1;
	}

	result=a;

	while((b-a)>=error){
		result=(a+b)/2;

		if(operacionAlgebraicaShuntingYard(ecuacion, result) == 0.0){
			result=result;
			//break;				//QUITAR ESTO DE INMEDIATO
		}
		else if(operacionAlgebraicaShuntingYard(ecuacion, result)*operacionAlgebraicaShuntingYard(ecuacion, a)<0){
			b=result;
		}
		else
			a=result;
	}

	printf("Resultado: %lf\n", result);
	return &result;
}

double *
multiplescomandos_1_svc(char *arg1,  struct svc_req *rqstp){
	static double result;
	result=operacionAlgebraicaShuntingYard(arg1, 0);

	return &result;
}

matrix *
restamatricial_1_svc(matrix arg1, matrix arg2,  struct svc_req *rqstp)
{
	static matrix  result;

	xdr_free((xdrproc_t)xdr_double, result.m.m_val);
	result.m.m_len=0;

	result.fil=arg1.fil;
	result.col=arg1.col;

	result.m.m_val=calloc(result.fil*result.col, sizeof(double));
	result.m.m_len=result.fil*result.col;

	for(int i=0; i<arg1.fil; i++)
		for(int j=0; j<arg1.col; j++)
			result.m.m_val[i*result.col+j]=arg1.m.m_val[i*result.col+j]-arg2.m.m_val[i*result.col+j];

	return &result;
}