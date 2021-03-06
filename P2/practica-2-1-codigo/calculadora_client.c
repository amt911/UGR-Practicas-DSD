/*
 * This is sample code generated by rpcgen.
 * These are only templates and you can use them
 * as a guideline for developing your own functions.
 */

#include "calculadora.h"
#include <time.h>
#include <assert.h>


//Funciones que solamente se ejecutan en el cliente

void reservarMatrix(matrix **m, int fil, int col){
	assert((*m)==NULL);

	*m=calloc(1, sizeof(matrix));

	(*m)->fil=fil;
	(*m)->col=col;

	(*m)->m.m_val=calloc(fil*col, sizeof(double));
	(*m)->m.m_len=fil*col;
}

void liberarMatrix(matrix **m){
	assert((*m)!=NULL);

	free((*m)->m.m_val);
	free(*m);

	*m=NULL;
}

void imprimirMatriz(matrix *m){
		for (int i = 0; i < m->fil; i++)
		{
			for (int j = 0; j < m->col; j++)
			{
				printf("%lf ", m->m.m_val[i*m->col+j]);
			}

			printf("\n");
			
		}
}


void rellenarMatriz(matrix *m1){
	for(int i=0; i<m1->fil; i++){
		printf("Fila %d valores: ", i);
		for (int j = 0; j < m1->col; j++)
		{
			scanf("%lf", &(m1->m.m_val[i*m1->col+j]));
		}
	}	
}

void multiplescomandos_calculadora_1(char *host, char *str){
	CLIENT *clnt;
	double *res;

#ifndef	DEBUG
	clnt = clnt_create (host, CALCULADORA, CALCULADORAVER, "udp");
	if (clnt == NULL) {
		clnt_pcreateerror (host);
		exit (1);
	}
#endif	/* DEBUG */


	res = multiplescomandos_1(str, clnt);
	if (res == (double *) NULL) {
		clnt_perror (clnt, "call failed");
	}
	else{
		printf("#####################################\n");
		printf("El resultado es: %lf\n", *res);
		printf("#####################################\n");

		xdr_free((xdrproc_t) xdr_double, res);
	}
#ifndef	DEBUG
	clnt_destroy (clnt);
#endif	 /* DEBUG */
}

void suma_calculadora_1(char *host, double a, double b){
	CLIENT *clnt;
	double *res;

#ifndef	DEBUG
	clnt = clnt_create (host, CALCULADORA, CALCULADORAVER, "udp");
	if (clnt == NULL) {
		clnt_pcreateerror (host);
		exit (1);
	}
#endif	/* DEBUG */


	res = suma_1(a, b, clnt);
	if (res == (double *) NULL) {
		clnt_perror (clnt, "call failed");
	}
	else{
		printf("#####################################\n");
		printf("El resultado es: %lf\n", *res);
		printf("#####################################\n");

		xdr_free((xdrproc_t) xdr_double, res);
	}
#ifndef	DEBUG
	clnt_destroy (clnt);
#endif	 /* DEBUG */
}

void resta_calculadora_1(char *host, double a, double b){
	CLIENT *clnt;
	double *res;

#ifndef	DEBUG
	clnt = clnt_create (host, CALCULADORA, CALCULADORAVER, "udp");
	if (clnt == NULL) {
		clnt_pcreateerror (host);
		exit (1);
	}
#endif	/* DEBUG */


	res = resta_1(a, b, clnt);
	if (res == (double *) NULL) {
		clnt_perror (clnt, "call failed");
	}
	else{
			printf("#####################################\n");
			printf("El resultado es: %lf\n", *res);
			printf("#####################################\n");

		xdr_free((xdrproc_t) xdr_double, res);
	}
#ifndef	DEBUG
	clnt_destroy (clnt);
#endif	 /* DEBUG */
}

void mult_calculadora_1(char *host, double a, double b){
	CLIENT *clnt;
	double *res;

#ifndef	DEBUG
	clnt = clnt_create (host, CALCULADORA, CALCULADORAVER, "udp");
	if (clnt == NULL) {
		clnt_pcreateerror (host);
		exit (1);
	}
#endif	/* DEBUG */


	res = mult_1(a, b, clnt);
	if (res == (double *) NULL) {
		clnt_perror (clnt, "call failed");
	}
	else{
		printf("#####################################\n");
		printf("El resultado es: %lf\n", *res);
		printf("#####################################\n");
		xdr_free((xdrproc_t) xdr_double, res);
	}
#ifndef	DEBUG
	clnt_destroy (clnt);
#endif	 /* DEBUG */
}


void division_calculadora_1(char *host, double a, double b){
	CLIENT *clnt;
	double *res;

#ifndef	DEBUG
	clnt = clnt_create (host, CALCULADORA, CALCULADORAVER, "udp");
	if (clnt == NULL) {
		clnt_pcreateerror (host);
		exit (1);
	}
#endif	/* DEBUG */


	res = division_1(a, b, clnt);
	if (res == (double *) NULL) {
		clnt_perror (clnt, "call failed");
	}
	else{
			printf("#####################################\n");
			printf("El resultado es: %lf\n", *res);
			printf("#####################################\n");

		xdr_free((xdrproc_t) xdr_double, res);
	}
#ifndef	DEBUG
	clnt_destroy (clnt);
#endif	 /* DEBUG */
}


void modulo_calculadora_1(char *host, int a, int b){
	CLIENT *clnt;
	int *res;

#ifndef	DEBUG
	clnt = clnt_create (host, CALCULADORA, CALCULADORAVER, "udp");
	if (clnt == NULL) {
		clnt_pcreateerror (host);
		exit (1);
	}
#endif	/* DEBUG */


	res = modulo_1(a, b, clnt);
	if (res == (int *) NULL) {
		clnt_perror (clnt, "call failed");
	}
	else{
			printf("#####################################\n");
			printf("El resultado es: %d\n", *res);
			printf("#####################################\n");

		xdr_free((xdrproc_t) xdr_int, res);
	}
#ifndef	DEBUG
	clnt_destroy (clnt);
#endif	 /* DEBUG */
}

void raizcuadrada_calculadora_1(char *host, double a){
	CLIENT *clnt;
	double *res;

#ifndef	DEBUG
	clnt = clnt_create (host, CALCULADORA, CALCULADORAVER, "udp");
	if (clnt == NULL) {
		clnt_pcreateerror (host);
		exit (1);
	}
#endif	/* DEBUG */


	res = raizcuadrada_1(a, clnt);
	if (res == (double *) NULL) {
		clnt_perror (clnt, "call failed");
	}
	else{
			printf("#####################################\n");
			printf("El resultado es: %lf\n", *res);
			printf("#####################################\n");

		xdr_free((xdrproc_t) xdr_double, res);
	}
#ifndef	DEBUG
	clnt_destroy (clnt);
#endif	 /* DEBUG */
}

void esprimo_calculadora_1(char *host, int a){
	CLIENT *clnt;
	int *res;

#ifndef	DEBUG
	clnt = clnt_create (host, CALCULADORA, CALCULADORAVER, "udp");
	if (clnt == NULL) {
		clnt_pcreateerror (host);
		exit (1);
	}
#endif	/* DEBUG */


	res = esprimo_1(a, clnt);
	if (res == (int *) NULL) {
		clnt_perror (clnt, "call failed");
	}
	else{
			printf("#####################################\n");
			printf("El resultado es: ");

			if(*res==1)
				printf("Es primo\n");
			else
				printf("No es primo\n");

			printf("#####################################\n");

		xdr_free((xdrproc_t) xdr_int, res);
	}
#ifndef	DEBUG
	clnt_destroy (clnt);
#endif	 /* DEBUG */
}

void potencia_calculadora_1(char *host, int a, int b){
	CLIENT *clnt;
	int *res;
#ifndef	DEBUG
	clnt = clnt_create (host, CALCULADORA, CALCULADORAVER, "udp");
	if (clnt == NULL) {
		clnt_pcreateerror (host);
		exit (1);
	}
#endif	/* DEBUG */


	res = potencia_1(a, b, clnt);
	if (res == (int *) NULL) {
		clnt_perror (clnt, "call failed");
	}
	else{
			printf("#####################################\n");
			printf("El resultado es: %d\n", *res);
			printf("#####################################\n");

		xdr_free((xdrproc_t) xdr_int, res);
	}
#ifndef	DEBUG
	clnt_destroy (clnt);
#endif	 /* DEBUG */
}

void factorial_calculadora_1(char *host, int a){
	CLIENT *clnt;
	int *res;
#ifndef	DEBUG
	clnt = clnt_create (host, CALCULADORA, CALCULADORAVER, "udp");
	if (clnt == NULL) {
		clnt_pcreateerror (host);
		exit (1);
	}
#endif	/* DEBUG */


	res = factorial_1(a, clnt);
	if (res == (int *) NULL) {
		clnt_perror (clnt, "call failed");
	}
	else{
		printf("#####################################\n");
		printf("El resultado es: %d\n", *res);
		printf("#####################################\n");

		xdr_free((xdrproc_t) xdr_int, res);
	}
#ifndef	DEBUG
	clnt_destroy (clnt);
#endif	 /* DEBUG */
}

void
sumamatricial_calculadora_1(char *host, matrix m1, matrix m2)
{
	CLIENT *clnt;
	matrix *res;

#ifndef	DEBUG
	clnt = clnt_create (host, CALCULADORA, CALCULADORAVER, "udp");
	if (clnt == NULL) {
		clnt_pcreateerror (host);
		exit (1);
	}
#endif	/* DEBUG */

	res = sumamatricial_1(m1, m2, clnt);
	if (res == (matrix *) NULL) {
		clnt_perror (clnt, "call failed");
	}
	else{
		printf("#####################################\n");
		printf("La suma matricial es: \n");		

		imprimirMatriz(res);		
		printf("#####################################\n");

		printf("\n");
		xdr_free((xdrproc_t) xdr_double, res->m.m_val);
		xdr_free((xdrproc_t) xdr_matrix, res);
	}
#ifndef	DEBUG
	clnt_destroy (clnt);
#endif	 /* DEBUG */
}

void
restamatricial_calculadora_1(char *host, matrix m1, matrix m2)
{
	CLIENT *clnt;
	matrix *res;

#ifndef	DEBUG
	clnt = clnt_create (host, CALCULADORA, CALCULADORAVER, "udp");
	if (clnt == NULL) {
		clnt_pcreateerror (host);
		exit (1);
	}
#endif	/* DEBUG */

	res = restamatricial_1(m1, m2, clnt);
	if (res == (matrix *) NULL) {
		clnt_perror (clnt, "call failed");
	}
	else{
		printf("#####################################\n");
		printf("La resta matricial es: \n");		

		imprimirMatriz(res);		
		printf("#####################################\n");

		printf("\n");
		xdr_free((xdrproc_t) xdr_double, res->m.m_val);
		xdr_free((xdrproc_t) xdr_matrix, res);
	}
#ifndef	DEBUG
	clnt_destroy (clnt);
#endif	 /* DEBUG */
}

void
multmatricial_calculadora_1(char *host, matrix m1, matrix m2)
{
	CLIENT *clnt;
	matrix *res;

#ifndef	DEBUG
	clnt = clnt_create (host, CALCULADORA, CALCULADORAVER, "udp");
	if (clnt == NULL) {
		clnt_pcreateerror (host);
		exit (1);
	}
#endif	/* DEBUG */

	res = multmatricial_1(m1, m2, clnt);
	if (res == (matrix *) NULL) {
		clnt_perror (clnt, "call failed");
	}
	else{
		printf("#####################################\n");
		printf("La multiplicacion matricial es: \n");		

		imprimirMatriz(res);		
		printf("#####################################\n");

		printf("\n");
		xdr_free((xdrproc_t) xdr_double, res->m.m_val);
		xdr_free((xdrproc_t) xdr_matrix, res);
	}
#ifndef	DEBUG
	clnt_destroy (clnt);
#endif	 /* DEBUG */
}

void
traspuesta_calculadora_1(char *host, matrix m)
{
	CLIENT *clnt;
	matrix *res;

#ifndef	DEBUG
	clnt = clnt_create (host, CALCULADORA, CALCULADORAVER, "udp");
	if (clnt == NULL) {
		clnt_pcreateerror (host);
		exit (1);
	}
#endif	/* DEBUG */

	res = traspuesta_1(m, clnt);
	if (res == (matrix *) NULL) {
		clnt_perror (clnt, "call failed");
	}
	else{
		printf("#####################################\n");
		printf("La traspuesta de la matriz es: \n");		
		imprimirMatriz(res);		
		printf("#####################################\n");

		printf("\n");
		xdr_free((xdrproc_t) xdr_double, res->m.m_val);
		xdr_free((xdrproc_t) xdr_matrix, res);
	}
#ifndef	DEBUG
	clnt_destroy (clnt);
#endif	 /* DEBUG */
}


void resolverecuaciones_calculadora_1(char *host, char *ecuacion, double error, double inf, double sup){
		CLIENT *clnt;
	char **res;

#ifndef	DEBUG
	clnt = clnt_create (host, CALCULADORA, CALCULADORAVER, "udp");
	if (clnt == NULL) {
		clnt_pcreateerror (host);
		exit (1);
	}
#endif	/* DEBUG */


	res = resolverecuaciones_1(ecuacion, error, inf, sup, clnt);
	if (res == (char **) NULL) {
		clnt_perror (clnt, "call failed");
	}
	else{
			printf("#####################################\n");
			printf("El resultado es: %s\n", *res);
			printf("#####################################\n");
			
		xdr_free((xdrproc_t) xdr_char, res);
	}
#ifndef	DEBUG
	clnt_destroy (clnt);
#endif	 /* DEBUG */
}


int
main (int argc, char *argv[])
{
	char *host;

	if (argc < 2) {
		printf ("usage: %s server_host\n", argv[0]);
		exit (1);
	}
	host = argv[1];

	if(argc==2){		//Modo interactivo
		#define SALIDA 100
		#define NUM_OPCIONES 16
		unsigned char opcion;
		printf("Modo interactivo\n");

		do{
			do{
				printf("Calculadora, opciones: \n");
				printf("1.- Suma\n");
				printf("2.- Resta\n");
				printf("3.- Multiplicacion\n");
				printf("4.- Division\n");
				printf("5.- Raiz Cuadrada\n");
				printf("6.- Modulo (primer_valor mod segundo valor)\n");
				printf("7.- Potencia (primer_valor)^(segundo_valor)\n");
				printf("8.- Comprobar si un numero es primo\n");
				printf("9.- Factorial\n");
				printf("10.- Suma matricial\n");
				printf("11.- Resta matricial\n");
				printf("12.- Multiplicacion matricial\n");
				printf("13.- Traspuesta de una matriz\n");
				printf("14.- Calculo de una cadena de operaciones respetando la jerarquia de operaciones\n");
				printf("15.- Resolver ecuaciones de la forma ...=0\n");
				printf("16.- Producto escalar de dos vectores\n");
				printf("%d.- Salir del programa\n", SALIDA);
				printf("Introduzca la opcion: ");
				scanf("%hhd", &opcion);

				if((opcion<1 || opcion>NUM_OPCIONES) && opcion!=SALIDA)
					printf("Opcion incorrecta\n");
			}while((opcion<1 || opcion>NUM_OPCIONES) && opcion!=SALIDA);

		double v1, v2, error, inf, sup;
		matrix *m1=NULL, *m2=NULL;
		int fil, col;
		char *v=NULL;

		//Fase de pedir los datos

		switch(opcion){
			//Operadores binarios
			case 1:
			case 2:
			case 3:
			case 4:
			case 6:
			case 7:
				printf("Introduzca el primer valor: ");
				scanf("%lf", &v1);

				printf("Introduzca el otro valor: ");
				scanf("%lf", &v2);
				break;

			//Operadores unarios
			case 5:
			case 8:
			case 9:
				printf("Introduzca el valor: ");
				scanf("%lf", &v1);
				break;

			//Operaciones donde ambas matrices deben tener el mismo tama??o
			case 10:
			case 11:
				printf("Matriz num filas: ");
				scanf("%d", &fil);

				printf("Matriz columnas: ");
				scanf("%d", &col);

				reservarMatrix(&m1, fil, col);
				reservarMatrix(&m2, fil, col);

				printf("\n--------------------------------\n");
				printf("Primera matriz: \n");
				rellenarMatriz(m1);

				printf("\n--------------------------------\n");
				printf("Segunda matriz: \n");
				rellenarMatriz(m2);

				printf("\n-------------Operandos-------------------\n");
				printf("Primera matriz: \n");
				imprimirMatriz(m1);

				printf("--------------------------------");
				printf("\nSegunda matriz: \n");
				imprimirMatriz(m2);

				printf("\n--------------------------------\n");

				break;

			case 12:
				printf("Filas Matriz 1: ");
				scanf("%d", &fil);

				printf("Columnas Matriz 1: ");
				scanf("%d", &col);

				reservarMatrix(&m1, fil, col);
				reservarMatrix(&m2, col, fil);

				printf("\n--------------------------------\n");
				printf("Primera matriz: \n");
				rellenarMatriz(m1);

				printf("\n--------------------------------\n");
				printf("Segunda matriz: \n");
				rellenarMatriz(m2);

				printf("\n-------------Operandos-------------------\n");
				printf("Primera matriz: \n");
				imprimirMatriz(m1);

				printf("--------------------------------");
				printf("\nSegunda matriz: \n");
				imprimirMatriz(m2);

				printf("\n--------------------------------\n");
				break;

			case 14:
				v=calloc(1000, sizeof(char));
				printf("Introduzca expresion algebraica (c(): cos(), s(): sin(), t(): tan(), s(): sqrt(), e(): exp()): ");
				scanf("%s", v);
				
				break;

			case 15:
				v=calloc(1000, sizeof(char));
				printf("Introduzca ecuacion en funcion de x (c(): cos(), s(): sin(), t(): tan(), s(): sqrt(), e(): exp()): ");
				scanf("%s", v);

				printf("Introduzca el error: ");
				scanf("%lf", &error);

				printf("L??mite inferior: ");
				scanf("%lf", &inf);

				printf("L??mite superior: ");
				scanf("%lf", &sup);


				break;

			case 13:
				printf("Matriz num filas: ");
				scanf("%d", &fil);

				printf("Matriz columnas: ");
				scanf("%d", &col);

				reservarMatrix(&m1, fil, col);

				printf("\n--------------------------------\n");
				
				printf("Matriz: \n");
				rellenarMatriz(m1);

				printf("\n-------------Operandos-------------------\n");
				
				printf("Matriz: \n");
				imprimirMatriz(m1);

				printf("--------------------------------\n");

				break;		


				case 16:
					printf("Numero de elementos de los vectores: ");
					scanf("%d", &col);

					reservarMatrix(&m1, 1, col);
					reservarMatrix(&m2, col, 1);

					printf("\n--------------------------------\n");
					printf("Primer vector: \n");
					rellenarMatriz(m1);

					printf("\n--------------------------------\n");
					printf("Segundo vector: \n");
					rellenarMatriz(m2);

					printf("\n-------------Operandos-------------------\n");
					printf("Primer vector: \n");
					imprimirMatriz(m1);

					printf("--------------------------------");
					printf("\nSegundo vector: \n");
					imprimirMatriz(m2);

					printf("\n--------------------------------\n");				

			default:
			//printf("Opcion no implementada\n");
			break;
		}


		//Fase de llamar a las funciones
		switch(opcion){
			case 1:
				suma_calculadora_1(host, v1, v2);
				break;

			case 2:
				resta_calculadora_1(host, v1, v2);
				break;

			case 3:
				mult_calculadora_1(host, v1, v2);
				break;

			case 4:
				division_calculadora_1(host, v1, v2);
				break;

			case 5:
				raizcuadrada_calculadora_1(host, v1);
				break;

			case 6:
				modulo_calculadora_1(host, v1, v2);
				break;

			case 7:
				potencia_calculadora_1(host, v1, v2);
				break;

			case 8:
				esprimo_calculadora_1(host, v1);
				break;

			case 9:			
				factorial_calculadora_1(host, v1);
				break;	

			case 10:
				sumamatricial_calculadora_1(host, *m1, *m2);

				liberarMatrix(&m1);
				liberarMatrix(&m2);
				break;

			case 11:
				restamatricial_calculadora_1(host, *m1, *m2);

				liberarMatrix(&m1);
				liberarMatrix(&m2);
				break;

			case 12:
			case 16:
				multmatricial_calculadora_1(host, *m1, *m2);

				liberarMatrix(&m1);
				liberarMatrix(&m2);
				break;

			case 14:
				multiplescomandos_calculadora_1(host, v);
				free(v);
				v=NULL;

				break;

			case 15:
				resolverecuaciones_calculadora_1(host, v, error, inf , sup);
				free(v);
				v=NULL;
				break;

			case 13:
				traspuesta_calculadora_1(host, *m1);
				liberarMatrix(&m1);
				break;

		}
		}while(opcion!=SALIDA);
	}
	else{	//Modo consola
		char operacion=argv[3][0];

		switch(operacion){
			case '+':
				suma_calculadora_1(host, atof(argv[2]), atof(argv[4]));
				break;

			case '-':
				resta_calculadora_1(host, atof(argv[2]), atof(argv[4]));
				break;			

			case 'x':
				mult_calculadora_1(host, atof(argv[2]), atof(argv[4]));
				break;				

			case '/':
				division_calculadora_1(host, atof(argv[2]), atof(argv[4]));
				break;				
		}
	}

exit (0);
}
