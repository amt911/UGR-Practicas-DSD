/*
 * This is sample code generated by rpcgen.
 * These are only templates and you can use them
 * as a guideline for developing your own functions.
 */

#include "calculadora.h"
#include <math.h>
#include <string.h>
#include <assert.h>

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

double *
raizcuadrada_1_svc(double arg1,  struct svc_req *rqstp)
{
	static double  result;

	result=sqrt(arg1);

	return &result;
}

double *
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

	/*
	 * insert server code here
	 */

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

matrix *
resolverecuaciones_1_svc(matrix arg1,  struct svc_req *rqstp)
{
	static matrix  result;

	/*
	 * insert server code here
	 */

	return &result;
}

double *
multiplescomandos_1_svc(char *arg1,  struct svc_req *rqstp)
{
	//Se aplica el algoritmo de shunting yard de Dijkstra
	static double  result;
	char salida[1000], operadores[1000];
	int contSalida=0, contOperadores=0;
	char prioridades[]={'^', '*', '/', '+', '-'};
	int prioridadesValor[]={3, 2, 2, 1, 1};
	//unsigned char esNro=1;

	for(int i=0; arg1[i]!='\0'; i++){
		switch(arg1[i]){
			case '+':
			case '-':
			case '*':
			case '/':
			case '^':			//Se considera que la potencia es right associative

				salida[contSalida++]='|';		//Caracter especial para detectar numeros con mas de una cifra
				while(contOperadores>0 && operadores[contOperadores-1]!='(' && ((prioridadesValor[strchr(prioridades, operadores[contOperadores-1])-prioridades]>prioridadesValor[strchr(prioridades, arg1[i])-prioridades]) || (prioridadesValor[strchr(prioridades, operadores[contOperadores-1])-prioridades]==prioridadesValor[strchr(prioridades, arg1[i])-prioridades] && prioridades[strchr(prioridades, arg1[i])-prioridades]!='^'))){
					salida[contSalida++]=operadores[--contOperadores];
					//contOperadores--;
				}
				operadores[contOperadores++]=arg1[i];
				break;

			case '(':
				operadores[contOperadores++]=arg1[i];
				break;

			case ')':
				while(operadores[contOperadores-1]!='('){
					assert(contOperadores>0);
					salida[contSalida++]=operadores[--contOperadores];
					//contOperadores--;
				}

				assert(operadores[contOperadores-1]=='(');
				contOperadores--;
				break;

			case '0':
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
				salida[contSalida++]=arg1[i];
				//esNro=1;
				break;
		}	
	}
	
	for(int i=contOperadores; i>0; i--)
		salida[contSalida++]=operadores[i-1];

	salida[contSalida++]='\0';

	printf("SALIDA POR FAVOR FUNCIONA: %s\n", salida);


	//Fase de calcular el propio valor especificado
	result=0;
	int calculo[1000], aux1, aux2;
	int contCalculo=0;

	for(int i=0; salida[i]!='\0'; i++){
		switch(salida[i]){
			case '+':
				assert(contCalculo>=2);
				aux2=calculo[--contCalculo];
				aux1=calculo[--contCalculo];
				calculo[contCalculo++]=aux1+aux2;
				break;			

			case '-':
				assert(contCalculo>=2);
				aux2=calculo[--contCalculo];
				aux1=calculo[--contCalculo];
				calculo[contCalculo++]=aux1-aux2;
				break;			

			case '*':
				assert(contCalculo>=2);
				aux2=calculo[--contCalculo];
				aux1=calculo[--contCalculo];
				calculo[contCalculo++]=aux1*aux2;
				break;			

			case '/':
				assert(contCalculo>=2);
				aux2=calculo[--contCalculo];
				aux1=calculo[--contCalculo];
				calculo[contCalculo++]=aux1/aux2;
				break;			

			case '^':
				assert(contCalculo>=2);
				aux2=calculo[--contCalculo];
				aux1=calculo[--contCalculo];
				calculo[contCalculo++]=pow(aux1, aux2);
				break;
			case '0':
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':			
				calculo[contCalculo++]=atoi(&salida[i]);
				break;
		}
	}

	printf("RESULTADO FINAL: %d\n", calculo[0]);

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