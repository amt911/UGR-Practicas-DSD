/*
 * Please do not edit this file.
 * It was generated using rpcgen.
 */

#ifndef _CALCULADORA_H_RPCGEN
#define _CALCULADORA_H_RPCGEN

#include <rpc/rpc.h>


#ifdef __cplusplus
extern "C" {
#endif


typedef struct {
	u_int m_len;
	double *m_val;
} m;

struct matrix {
	int fil;
	int col;
	m m;
};
typedef struct matrix matrix;

struct suma_1_argument {
	double arg1;
	double arg2;
};
typedef struct suma_1_argument suma_1_argument;

struct resta_1_argument {
	double arg1;
	double arg2;
};
typedef struct resta_1_argument resta_1_argument;

struct mult_1_argument {
	double arg1;
	double arg2;
};
typedef struct mult_1_argument mult_1_argument;

struct division_1_argument {
	double arg1;
	double arg2;
};
typedef struct division_1_argument division_1_argument;

struct modulo_1_argument {
	int arg1;
	int arg2;
};
typedef struct modulo_1_argument modulo_1_argument;

struct logaritmo_1_argument {
	int arg1;
	int arg2;
};
typedef struct logaritmo_1_argument logaritmo_1_argument;

struct potencia_1_argument {
	int arg1;
	int arg2;
};
typedef struct potencia_1_argument potencia_1_argument;

struct sumamatricial_1_argument {
	matrix arg1;
	matrix arg2;
};
typedef struct sumamatricial_1_argument sumamatricial_1_argument;

struct restamatricial_1_argument {
	matrix arg1;
	matrix arg2;
};
typedef struct restamatricial_1_argument restamatricial_1_argument;

struct multmatricial_1_argument {
	matrix arg1;
	matrix arg2;
};
typedef struct multmatricial_1_argument multmatricial_1_argument;

struct resolverecuaciones_1_argument {
	char *arg1;
	double arg2;
	double arg3;
	double arg4;
};
typedef struct resolverecuaciones_1_argument resolverecuaciones_1_argument;

#define CALCULADORA 0x20000001
#define CALCULADORAVER 1

#if defined(__STDC__) || defined(__cplusplus)
#define suma 1
extern  double * suma_1(double , double , CLIENT *);
extern  double * suma_1_svc(double , double , struct svc_req *);
#define resta 2
extern  double * resta_1(double , double , CLIENT *);
extern  double * resta_1_svc(double , double , struct svc_req *);
#define mult 3
extern  double * mult_1(double , double , CLIENT *);
extern  double * mult_1_svc(double , double , struct svc_req *);
#define division 4
extern  double * division_1(double , double , CLIENT *);
extern  double * division_1_svc(double , double , struct svc_req *);
#define modulo 5
extern  int * modulo_1(int , int , CLIENT *);
extern  int * modulo_1_svc(int , int , struct svc_req *);
#define raizCuadrada 6
extern  double * raizcuadrada_1(double , CLIENT *);
extern  double * raizcuadrada_1_svc(double , struct svc_req *);
#define logaritmo 7
extern  double * logaritmo_1(int , int , CLIENT *);
extern  double * logaritmo_1_svc(int , int , struct svc_req *);
#define esPrimo 8
extern  int * esprimo_1(int , CLIENT *);
extern  int * esprimo_1_svc(int , struct svc_req *);
#define potencia 9
extern  int * potencia_1(int , int , CLIENT *);
extern  int * potencia_1_svc(int , int , struct svc_req *);
#define factorial 10
extern  int * factorial_1(int , CLIENT *);
extern  int * factorial_1_svc(int , struct svc_req *);
#define sumaMatricial 11
extern  matrix * sumamatricial_1(matrix , matrix , CLIENT *);
extern  matrix * sumamatricial_1_svc(matrix , matrix , struct svc_req *);
#define restaMatricial 12
extern  matrix * restamatricial_1(matrix , matrix , CLIENT *);
extern  matrix * restamatricial_1_svc(matrix , matrix , struct svc_req *);
#define multMatricial 13
extern  matrix * multmatricial_1(matrix , matrix , CLIENT *);
extern  matrix * multmatricial_1_svc(matrix , matrix , struct svc_req *);
#define traspuesta 14
extern  matrix * traspuesta_1(matrix , CLIENT *);
extern  matrix * traspuesta_1_svc(matrix , struct svc_req *);
#define resolverEcuaciones 15
extern  char ** resolverecuaciones_1(char *, double , double , double , CLIENT *);
extern  char ** resolverecuaciones_1_svc(char *, double , double , double , struct svc_req *);
#define multiplesComandos 16
extern  double * multiplescomandos_1(char *, CLIENT *);
extern  double * multiplescomandos_1_svc(char *, struct svc_req *);
extern int calculadora_1_freeresult (SVCXPRT *, xdrproc_t, caddr_t);

#else /* K&R C */
#define suma 1
extern  double * suma_1();
extern  double * suma_1_svc();
#define resta 2
extern  double * resta_1();
extern  double * resta_1_svc();
#define mult 3
extern  double * mult_1();
extern  double * mult_1_svc();
#define division 4
extern  double * division_1();
extern  double * division_1_svc();
#define modulo 5
extern  int * modulo_1();
extern  int * modulo_1_svc();
#define raizCuadrada 6
extern  double * raizcuadrada_1();
extern  double * raizcuadrada_1_svc();
#define logaritmo 7
extern  double * logaritmo_1();
extern  double * logaritmo_1_svc();
#define esPrimo 8
extern  int * esprimo_1();
extern  int * esprimo_1_svc();
#define potencia 9
extern  int * potencia_1();
extern  int * potencia_1_svc();
#define factorial 10
extern  int * factorial_1();
extern  int * factorial_1_svc();
#define sumaMatricial 11
extern  matrix * sumamatricial_1();
extern  matrix * sumamatricial_1_svc();
#define restaMatricial 12
extern  matrix * restamatricial_1();
extern  matrix * restamatricial_1_svc();
#define multMatricial 13
extern  matrix * multmatricial_1();
extern  matrix * multmatricial_1_svc();
#define traspuesta 14
extern  matrix * traspuesta_1();
extern  matrix * traspuesta_1_svc();
#define resolverEcuaciones 15
extern  char ** resolverecuaciones_1();
extern  char ** resolverecuaciones_1_svc();
#define multiplesComandos 16
extern  double * multiplescomandos_1();
extern  double * multiplescomandos_1_svc();
extern int calculadora_1_freeresult ();
#endif /* K&R C */

/* the xdr functions */

#if defined(__STDC__) || defined(__cplusplus)
extern  bool_t xdr_m (XDR *, m*);
extern  bool_t xdr_matrix (XDR *, matrix*);
extern  bool_t xdr_suma_1_argument (XDR *, suma_1_argument*);
extern  bool_t xdr_resta_1_argument (XDR *, resta_1_argument*);
extern  bool_t xdr_mult_1_argument (XDR *, mult_1_argument*);
extern  bool_t xdr_division_1_argument (XDR *, division_1_argument*);
extern  bool_t xdr_modulo_1_argument (XDR *, modulo_1_argument*);
extern  bool_t xdr_logaritmo_1_argument (XDR *, logaritmo_1_argument*);
extern  bool_t xdr_potencia_1_argument (XDR *, potencia_1_argument*);
extern  bool_t xdr_sumamatricial_1_argument (XDR *, sumamatricial_1_argument*);
extern  bool_t xdr_restamatricial_1_argument (XDR *, restamatricial_1_argument*);
extern  bool_t xdr_multmatricial_1_argument (XDR *, multmatricial_1_argument*);
extern  bool_t xdr_resolverecuaciones_1_argument (XDR *, resolverecuaciones_1_argument*);

#else /* K&R C */
extern bool_t xdr_m ();
extern bool_t xdr_matrix ();
extern bool_t xdr_suma_1_argument ();
extern bool_t xdr_resta_1_argument ();
extern bool_t xdr_mult_1_argument ();
extern bool_t xdr_division_1_argument ();
extern bool_t xdr_modulo_1_argument ();
extern bool_t xdr_logaritmo_1_argument ();
extern bool_t xdr_potencia_1_argument ();
extern bool_t xdr_sumamatricial_1_argument ();
extern bool_t xdr_restamatricial_1_argument ();
extern bool_t xdr_multmatricial_1_argument ();
extern bool_t xdr_resolverecuaciones_1_argument ();

#endif /* K&R C */

#ifdef __cplusplus
}
#endif

#endif /* !_CALCULADORA_H_RPCGEN */
