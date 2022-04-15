/*
 * Please do not edit this file.
 * It was generated using rpcgen.
 */

#include <memory.h> /* for memset */
#include "calculadora.h"

/* Default timeout can be changed using clnt_control() */
static struct timeval TIMEOUT = { 25, 0 };

double *
suma_1(double arg1, double arg2,  CLIENT *clnt)
{
	suma_1_argument arg;
	static double clnt_res;

	memset((char *)&clnt_res, 0, sizeof(clnt_res));
	arg.arg1 = arg1;
	arg.arg2 = arg2;
	if (clnt_call (clnt, suma, (xdrproc_t) xdr_suma_1_argument, (caddr_t) &arg,
		(xdrproc_t) xdr_double, (caddr_t) &clnt_res,
		TIMEOUT) != RPC_SUCCESS) {
		return (NULL);
	}
	return (&clnt_res);
}

double *
resta_1(double arg1, double arg2,  CLIENT *clnt)
{
	resta_1_argument arg;
	static double clnt_res;

	memset((char *)&clnt_res, 0, sizeof(clnt_res));
	arg.arg1 = arg1;
	arg.arg2 = arg2;
	if (clnt_call (clnt, resta, (xdrproc_t) xdr_resta_1_argument, (caddr_t) &arg,
		(xdrproc_t) xdr_double, (caddr_t) &clnt_res,
		TIMEOUT) != RPC_SUCCESS) {
		return (NULL);
	}
	return (&clnt_res);
}

double *
mult_1(double arg1, double arg2,  CLIENT *clnt)
{
	mult_1_argument arg;
	static double clnt_res;

	memset((char *)&clnt_res, 0, sizeof(clnt_res));
	arg.arg1 = arg1;
	arg.arg2 = arg2;
	if (clnt_call (clnt, mult, (xdrproc_t) xdr_mult_1_argument, (caddr_t) &arg,
		(xdrproc_t) xdr_double, (caddr_t) &clnt_res,
		TIMEOUT) != RPC_SUCCESS) {
		return (NULL);
	}
	return (&clnt_res);
}

double *
division_1(double arg1, double arg2,  CLIENT *clnt)
{
	division_1_argument arg;
	static double clnt_res;

	memset((char *)&clnt_res, 0, sizeof(clnt_res));
	arg.arg1 = arg1;
	arg.arg2 = arg2;
	if (clnt_call (clnt, division, (xdrproc_t) xdr_division_1_argument, (caddr_t) &arg,
		(xdrproc_t) xdr_double, (caddr_t) &clnt_res,
		TIMEOUT) != RPC_SUCCESS) {
		return (NULL);
	}
	return (&clnt_res);
}

int *
modulo_1(int arg1, int arg2,  CLIENT *clnt)
{
	modulo_1_argument arg;
	static int clnt_res;

	memset((char *)&clnt_res, 0, sizeof(clnt_res));
	arg.arg1 = arg1;
	arg.arg2 = arg2;
	if (clnt_call (clnt, modulo, (xdrproc_t) xdr_modulo_1_argument, (caddr_t) &arg,
		(xdrproc_t) xdr_int, (caddr_t) &clnt_res,
		TIMEOUT) != RPC_SUCCESS) {
		return (NULL);
	}
	return (&clnt_res);
}

double *
raizcuadrada_1(double arg1,  CLIENT *clnt)
{
	static double clnt_res;

	memset((char *)&clnt_res, 0, sizeof(clnt_res));
	if (clnt_call (clnt, raizCuadrada,
		(xdrproc_t) xdr_double, (caddr_t) &arg1,
		(xdrproc_t) xdr_double, (caddr_t) &clnt_res,
		TIMEOUT) != RPC_SUCCESS) {
		return (NULL);
	}
	return (&clnt_res);
}

double *
logaritmo_1(int arg1, int arg2,  CLIENT *clnt)
{
	logaritmo_1_argument arg;
	static double clnt_res;

	memset((char *)&clnt_res, 0, sizeof(clnt_res));
	arg.arg1 = arg1;
	arg.arg2 = arg2;
	if (clnt_call (clnt, logaritmo, (xdrproc_t) xdr_logaritmo_1_argument, (caddr_t) &arg,
		(xdrproc_t) xdr_double, (caddr_t) &clnt_res,
		TIMEOUT) != RPC_SUCCESS) {
		return (NULL);
	}
	return (&clnt_res);
}

int *
esprimo_1(int arg1,  CLIENT *clnt)
{
	static int clnt_res;

	memset((char *)&clnt_res, 0, sizeof(clnt_res));
	if (clnt_call (clnt, esPrimo,
		(xdrproc_t) xdr_int, (caddr_t) &arg1,
		(xdrproc_t) xdr_int, (caddr_t) &clnt_res,
		TIMEOUT) != RPC_SUCCESS) {
		return (NULL);
	}
	return (&clnt_res);
}

int *
potencia_1(int arg1, int arg2,  CLIENT *clnt)
{
	potencia_1_argument arg;
	static int clnt_res;

	memset((char *)&clnt_res, 0, sizeof(clnt_res));
	arg.arg1 = arg1;
	arg.arg2 = arg2;
	if (clnt_call (clnt, potencia, (xdrproc_t) xdr_potencia_1_argument, (caddr_t) &arg,
		(xdrproc_t) xdr_int, (caddr_t) &clnt_res,
		TIMEOUT) != RPC_SUCCESS) {
		return (NULL);
	}
	return (&clnt_res);
}

int *
factorial_1(int arg1,  CLIENT *clnt)
{
	static int clnt_res;

	memset((char *)&clnt_res, 0, sizeof(clnt_res));
	if (clnt_call (clnt, factorial,
		(xdrproc_t) xdr_int, (caddr_t) &arg1,
		(xdrproc_t) xdr_int, (caddr_t) &clnt_res,
		TIMEOUT) != RPC_SUCCESS) {
		return (NULL);
	}
	return (&clnt_res);
}

matrix *
sumamatricial_1(matrix arg1, matrix arg2,  CLIENT *clnt)
{
	sumamatricial_1_argument arg;
	static matrix clnt_res;

	memset((char *)&clnt_res, 0, sizeof(clnt_res));
	arg.arg1 = arg1;
	arg.arg2 = arg2;
	if (clnt_call (clnt, sumaMatricial, (xdrproc_t) xdr_sumamatricial_1_argument, (caddr_t) &arg,
		(xdrproc_t) xdr_matrix, (caddr_t) &clnt_res,
		TIMEOUT) != RPC_SUCCESS) {
		return (NULL);
	}
	return (&clnt_res);
}

matrix *
restamatricial_1(matrix arg1, matrix arg2,  CLIENT *clnt)
{
	restamatricial_1_argument arg;
	static matrix clnt_res;

	memset((char *)&clnt_res, 0, sizeof(clnt_res));
	arg.arg1 = arg1;
	arg.arg2 = arg2;
	if (clnt_call (clnt, restaMatricial, (xdrproc_t) xdr_restamatricial_1_argument, (caddr_t) &arg,
		(xdrproc_t) xdr_matrix, (caddr_t) &clnt_res,
		TIMEOUT) != RPC_SUCCESS) {
		return (NULL);
	}
	return (&clnt_res);
}

matrix *
multmatricial_1(matrix arg1, matrix arg2,  CLIENT *clnt)
{
	multmatricial_1_argument arg;
	static matrix clnt_res;

	memset((char *)&clnt_res, 0, sizeof(clnt_res));
	arg.arg1 = arg1;
	arg.arg2 = arg2;
	if (clnt_call (clnt, multMatricial, (xdrproc_t) xdr_multmatricial_1_argument, (caddr_t) &arg,
		(xdrproc_t) xdr_matrix, (caddr_t) &clnt_res,
		TIMEOUT) != RPC_SUCCESS) {
		return (NULL);
	}
	return (&clnt_res);
}

matrix *
traspuesta_1(matrix arg1,  CLIENT *clnt)
{
	static matrix clnt_res;

	memset((char *)&clnt_res, 0, sizeof(clnt_res));
	if (clnt_call (clnt, traspuesta,
		(xdrproc_t) xdr_matrix, (caddr_t) &arg1,
		(xdrproc_t) xdr_matrix, (caddr_t) &clnt_res,
		TIMEOUT) != RPC_SUCCESS) {
		return (NULL);
	}
	return (&clnt_res);
}

char **
resolverecuaciones_1(char *arg1, double arg2, double arg3, double arg4,  CLIENT *clnt)
{
	resolverecuaciones_1_argument arg;
	static char *clnt_res;

	memset((char *)&clnt_res, 0, sizeof(clnt_res));
	arg.arg1 = arg1;
	arg.arg2 = arg2;
	arg.arg3 = arg3;
	arg.arg4 = arg4;
	if (clnt_call (clnt, resolverEcuaciones, (xdrproc_t) xdr_resolverecuaciones_1_argument, (caddr_t) &arg,
		(xdrproc_t) xdr_wrapstring, (caddr_t) &clnt_res,
		TIMEOUT) != RPC_SUCCESS) {
		return (NULL);
	}
	return (&clnt_res);
}

double *
multiplescomandos_1(char *arg1,  CLIENT *clnt)
{
	static double clnt_res;

	memset((char *)&clnt_res, 0, sizeof(clnt_res));
	if (clnt_call (clnt, multiplesComandos,
		(xdrproc_t) xdr_wrapstring, (caddr_t) &arg1,
		(xdrproc_t) xdr_double, (caddr_t) &clnt_res,
		TIMEOUT) != RPC_SUCCESS) {
		return (NULL);
	}
	return (&clnt_res);
}