/*
 * Please do not edit this file.
 * It was generated using rpcgen.
 */

#include "calculadora.h"
#include <stdio.h>
#include <stdlib.h>
#include <rpc/pmap_clnt.h>
#include <string.h>
#include <memory.h>
#include <sys/socket.h>
#include <netinet/in.h>

#ifndef SIG_PF
#define SIG_PF void(*)(int)
#endif

static double *
_suma_1 (suma_1_argument *argp, struct svc_req *rqstp)
{
	return (suma_1_svc(argp->arg1, argp->arg2, rqstp));
}

static double *
_resta_1 (resta_1_argument *argp, struct svc_req *rqstp)
{
	return (resta_1_svc(argp->arg1, argp->arg2, rqstp));
}

static double *
_mult_1 (mult_1_argument *argp, struct svc_req *rqstp)
{
	return (mult_1_svc(argp->arg1, argp->arg2, rqstp));
}

static double *
_division_1 (division_1_argument *argp, struct svc_req *rqstp)
{
	return (division_1_svc(argp->arg1, argp->arg2, rqstp));
}

static int *
_potencia_1 (potencia_1_argument *argp, struct svc_req *rqstp)
{
	return (potencia_1_svc(argp->arg1, argp->arg2, rqstp));
}

static int *
_esprimo_1 (int  *argp, struct svc_req *rqstp)
{
	return (esprimo_1_svc(*argp, rqstp));
}

static double *
_raizcuadrada_1 (double  *argp, struct svc_req *rqstp)
{
	return (raizcuadrada_1_svc(*argp, rqstp));
}

static double *
_logaritmo_1 (logaritmo_1_argument *argp, struct svc_req *rqstp)
{
	return (logaritmo_1_svc(argp->arg1, argp->arg2, rqstp));
}

static int *
_modulo_1 (modulo_1_argument *argp, struct svc_req *rqstp)
{
	return (modulo_1_svc(argp->arg1, argp->arg2, rqstp));
}

static int *
_factorial_1 (int  *argp, struct svc_req *rqstp)
{
	return (factorial_1_svc(*argp, rqstp));
}

static double *
_multiplescomandos_1 (char * *argp, struct svc_req *rqstp)
{
	return (multiplescomandos_1_svc(*argp, rqstp));
}

static void
calculadora_1(struct svc_req *rqstp, register SVCXPRT *transp)
{
	union {
		suma_1_argument suma_1_arg;
		resta_1_argument resta_1_arg;
		mult_1_argument mult_1_arg;
		division_1_argument division_1_arg;
		potencia_1_argument potencia_1_arg;
		int esprimo_1_arg;
		double raizcuadrada_1_arg;
		logaritmo_1_argument logaritmo_1_arg;
		modulo_1_argument modulo_1_arg;
		int factorial_1_arg;
		char *multiplescomandos_1_arg;
	} argument;
	char *result;
	xdrproc_t _xdr_argument, _xdr_result;
	char *(*local)(char *, struct svc_req *);

	switch (rqstp->rq_proc) {
	case NULLPROC:
		(void) svc_sendreply (transp, (xdrproc_t) xdr_void, (char *)NULL);
		return;

	case suma:
		_xdr_argument = (xdrproc_t) xdr_suma_1_argument;
		_xdr_result = (xdrproc_t) xdr_double;
		local = (char *(*)(char *, struct svc_req *)) _suma_1;
		break;

	case resta:
		_xdr_argument = (xdrproc_t) xdr_resta_1_argument;
		_xdr_result = (xdrproc_t) xdr_double;
		local = (char *(*)(char *, struct svc_req *)) _resta_1;
		break;

	case mult:
		_xdr_argument = (xdrproc_t) xdr_mult_1_argument;
		_xdr_result = (xdrproc_t) xdr_double;
		local = (char *(*)(char *, struct svc_req *)) _mult_1;
		break;

	case division:
		_xdr_argument = (xdrproc_t) xdr_division_1_argument;
		_xdr_result = (xdrproc_t) xdr_double;
		local = (char *(*)(char *, struct svc_req *)) _division_1;
		break;

	case potencia:
		_xdr_argument = (xdrproc_t) xdr_potencia_1_argument;
		_xdr_result = (xdrproc_t) xdr_int;
		local = (char *(*)(char *, struct svc_req *)) _potencia_1;
		break;

	case esPrimo:
		_xdr_argument = (xdrproc_t) xdr_int;
		_xdr_result = (xdrproc_t) xdr_int;
		local = (char *(*)(char *, struct svc_req *)) _esprimo_1;
		break;

	case raizCuadrada:
		_xdr_argument = (xdrproc_t) xdr_double;
		_xdr_result = (xdrproc_t) xdr_double;
		local = (char *(*)(char *, struct svc_req *)) _raizcuadrada_1;
		break;

	case logaritmo:
		_xdr_argument = (xdrproc_t) xdr_logaritmo_1_argument;
		_xdr_result = (xdrproc_t) xdr_double;
		local = (char *(*)(char *, struct svc_req *)) _logaritmo_1;
		break;

	case modulo:
		_xdr_argument = (xdrproc_t) xdr_modulo_1_argument;
		_xdr_result = (xdrproc_t) xdr_int;
		local = (char *(*)(char *, struct svc_req *)) _modulo_1;
		break;

	case factorial:
		_xdr_argument = (xdrproc_t) xdr_int;
		_xdr_result = (xdrproc_t) xdr_int;
		local = (char *(*)(char *, struct svc_req *)) _factorial_1;
		break;

	case multiplesComandos:
		_xdr_argument = (xdrproc_t) xdr_wrapstring;
		_xdr_result = (xdrproc_t) xdr_double;
		local = (char *(*)(char *, struct svc_req *)) _multiplescomandos_1;
		break;

	default:
		svcerr_noproc (transp);
		return;
	}
	memset ((char *)&argument, 0, sizeof (argument));
	if (!svc_getargs (transp, (xdrproc_t) _xdr_argument, (caddr_t) &argument)) {
		svcerr_decode (transp);
		return;
	}
	result = (*local)((char *)&argument, rqstp);
	if (result != NULL && !svc_sendreply(transp, (xdrproc_t) _xdr_result, result)) {
		svcerr_systemerr (transp);
	}
	if (!svc_freeargs (transp, (xdrproc_t) _xdr_argument, (caddr_t) &argument)) {
		fprintf (stderr, "%s", "unable to free arguments");
		exit (1);
	}
	return;
}

int
main (int argc, char **argv)
{
	register SVCXPRT *transp;

	pmap_unset (CALCULADORA, CALCULADORAVER);

	transp = svcudp_create(RPC_ANYSOCK);
	if (transp == NULL) {
		fprintf (stderr, "%s", "cannot create udp service.");
		exit(1);
	}
	if (!svc_register(transp, CALCULADORA, CALCULADORAVER, calculadora_1, IPPROTO_UDP)) {
		fprintf (stderr, "%s", "unable to register (CALCULADORA, CALCULADORAVER, udp).");
		exit(1);
	}

	transp = svctcp_create(RPC_ANYSOCK, 0, 0);
	if (transp == NULL) {
		fprintf (stderr, "%s", "cannot create tcp service.");
		exit(1);
	}
	if (!svc_register(transp, CALCULADORA, CALCULADORAVER, calculadora_1, IPPROTO_TCP)) {
		fprintf (stderr, "%s", "unable to register (CALCULADORA, CALCULADORAVER, tcp).");
		exit(1);
	}

	svc_run ();
	fprintf (stderr, "%s", "svc_run returned");
	exit (1);
	/* NOTREACHED */
}
