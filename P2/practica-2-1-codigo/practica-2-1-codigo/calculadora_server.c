/*
 * This is sample code generated by rpcgen.
 * These are only templates and you can use them
 * as a guideline for developing your own functions.
 */

#include "calculadora.h"
#include <math.h>

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

	//printf("RESULTADO: %d\n", result);
	//printf("arg1: %d\n", arg1);

	for(int i=1; i<=arg1 && result!=-1; i++){
		if(i>(INT_MAX/result)){		//En caso de que haya overflow se pone a -1 y se sale
			result=-1;
		}
		else
			result*=i;
	}

	//printf("RESULTADO: %d\n", result);

	return &result;
}

matrix *
sumamatricial_1_svc(matrix arg1, matrix arg2,  struct svc_req *rqstp)
{
	printf("A ver si entramos de una vez\n");
	static matrix  result;

	xdr_free((xdrproc_t)xdr_double, result.m.m_val);

	result.fil=arg1.fil;
	result.col=arg1.col;

	result.m.m_val=calloc(result.fil*result.col, sizeof(double));
	result.m.m_len=result.fil*result.col*sizeof(double);

	for(int i=0; i<arg1.fil; i++)
		for(int j=0; j<arg1.col; j++)
			result.m.m_val[i*result.col+j]=arg1.m.m_val[i*result.col+j]+arg2.m.m_val[i*result.col+j];

	return &result;
}

matrix *
multmatricial_1_svc(matrix arg1, matrix arg2,  struct svc_req *rqstp)
{
	static matrix  result;

	/*
	 * insert server code here
	 */

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
resolversistemas_1_svc(matrix arg1,  struct svc_req *rqstp)
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
	static double  result;

	/*
	 * insert server code here
	 */

	return &result;
}
