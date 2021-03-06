/*
 * Please do not edit this file.
 * It was generated using rpcgen.
 */

#include "calculadora.h"

bool_t
xdr_m (XDR *xdrs, m *objp)
{
	register int32_t *buf;

	 if (!xdr_array (xdrs, (char **)&objp->m_val, (u_int *) &objp->m_len, ~0,
		sizeof (double), (xdrproc_t) xdr_double))
		 return FALSE;
	return TRUE;
}

bool_t
xdr_matrix (XDR *xdrs, matrix *objp)
{
	register int32_t *buf;

	 if (!xdr_int (xdrs, &objp->fil))
		 return FALSE;
	 if (!xdr_int (xdrs, &objp->col))
		 return FALSE;
	 if (!xdr_m (xdrs, &objp->m))
		 return FALSE;
	return TRUE;
}

bool_t
xdr_suma_1_argument (XDR *xdrs, suma_1_argument *objp)
{
	 if (!xdr_double (xdrs, &objp->arg1))
		 return FALSE;
	 if (!xdr_double (xdrs, &objp->arg2))
		 return FALSE;
	return TRUE;
}

bool_t
xdr_resta_1_argument (XDR *xdrs, resta_1_argument *objp)
{
	 if (!xdr_double (xdrs, &objp->arg1))
		 return FALSE;
	 if (!xdr_double (xdrs, &objp->arg2))
		 return FALSE;
	return TRUE;
}

bool_t
xdr_mult_1_argument (XDR *xdrs, mult_1_argument *objp)
{
	 if (!xdr_double (xdrs, &objp->arg1))
		 return FALSE;
	 if (!xdr_double (xdrs, &objp->arg2))
		 return FALSE;
	return TRUE;
}

bool_t
xdr_division_1_argument (XDR *xdrs, division_1_argument *objp)
{
	 if (!xdr_double (xdrs, &objp->arg1))
		 return FALSE;
	 if (!xdr_double (xdrs, &objp->arg2))
		 return FALSE;
	return TRUE;
}

bool_t
xdr_modulo_1_argument (XDR *xdrs, modulo_1_argument *objp)
{
	 if (!xdr_int (xdrs, &objp->arg1))
		 return FALSE;
	 if (!xdr_int (xdrs, &objp->arg2))
		 return FALSE;
	return TRUE;
}

bool_t
xdr_logaritmo_1_argument (XDR *xdrs, logaritmo_1_argument *objp)
{
	 if (!xdr_int (xdrs, &objp->arg1))
		 return FALSE;
	 if (!xdr_int (xdrs, &objp->arg2))
		 return FALSE;
	return TRUE;
}

bool_t
xdr_potencia_1_argument (XDR *xdrs, potencia_1_argument *objp)
{
	 if (!xdr_int (xdrs, &objp->arg1))
		 return FALSE;
	 if (!xdr_int (xdrs, &objp->arg2))
		 return FALSE;
	return TRUE;
}

bool_t
xdr_sumamatricial_1_argument (XDR *xdrs, sumamatricial_1_argument *objp)
{
	 if (!xdr_matrix (xdrs, &objp->arg1))
		 return FALSE;
	 if (!xdr_matrix (xdrs, &objp->arg2))
		 return FALSE;
	return TRUE;
}

bool_t
xdr_restamatricial_1_argument (XDR *xdrs, restamatricial_1_argument *objp)
{
	 if (!xdr_matrix (xdrs, &objp->arg1))
		 return FALSE;
	 if (!xdr_matrix (xdrs, &objp->arg2))
		 return FALSE;
	return TRUE;
}

bool_t
xdr_multmatricial_1_argument (XDR *xdrs, multmatricial_1_argument *objp)
{
	 if (!xdr_matrix (xdrs, &objp->arg1))
		 return FALSE;
	 if (!xdr_matrix (xdrs, &objp->arg2))
		 return FALSE;
	return TRUE;
}

bool_t
xdr_resolverecuaciones_1_argument (XDR *xdrs, resolverecuaciones_1_argument *objp)
{
	 if (!xdr_string (xdrs, &objp->arg1, ~0))
		 return FALSE;
	 if (!xdr_double (xdrs, &objp->arg2))
		 return FALSE;
	 if (!xdr_double (xdrs, &objp->arg3))
		 return FALSE;
	 if (!xdr_double (xdrs, &objp->arg4))
		 return FALSE;
	return TRUE;
}
