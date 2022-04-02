import java.util.ArrayList;
import java.util.Scanner;

import org.apache.thrift.TException;
import org.apache.thrift.transport.TSSLTransportFactory;
import org.apache.thrift.transport.TTransport;
import org.apache.thrift.transport.TTransportException;
import org.apache.thrift.transport.TSocket;
import org.apache.thrift.transport.TSSLTransportFactory.TSSLTransportParameters;
import org.apache.thrift.protocol.TBinaryProtocol;
import org.apache.thrift.protocol.TProtocol;

public class Cliente{
    public static void main(String [] args){
        try {
            TTransport transport;
            transport = new TSocket("localhost", 9090);
            TProtocol protocol=new TBinaryProtocol(transport);
            Calculadora.Client client=new Calculadora.Client(protocol);

            transport.open();

            Scanner s=new Scanner(System.in);
            final int SALIDA=100;
            final int NUM_OPCIONES=15;
            int opcion;
            
            do{
                do{
                    System.out.println("Calculadora, opciones: ");
                    System.out.println("1.- Suma");
                    System.out.println("2.- Resta");
                    System.out.println("3.- Multiplicacion");
                    System.out.println("4.- Division");
                    System.out.println("5.- Raiz Cuadrada");
                    System.out.println("6.- Modulo (primer_valor mod segundo valor)");
                    System.out.println("7.- Potencia (primer_valor)^(segundo_valor)");
                    System.out.println("8.- Comprobar si un numero es primo");
                    System.out.println("9.- Factorial");
                    System.out.println("10.- Suma matricial");
                    System.out.println("11.- Resta matricial");
                    System.out.println("12.- Multiplicacion matricial");
                    System.out.println("13.- Calculo de una cadena de operaciones respetando la jerarquia de operaciones");
                    System.out.println("14.- Resolver ecuaciones de la forma ...=0");
                    System.out.println("15.- Traspuesta de una matriz");
                    System.out.println(SALIDA+".- Salir del programa");
                    System.out.print("Introduzca la opcion: ");
                    //scanf("%hhd", &opcion);
                    opcion=s.nextInt();
                    
                    if((opcion<1 || opcion>NUM_OPCIONES) && opcion!=SALIDA)
                        System.out.println("Opcion incorrecta");
                }while((opcion<1 || opcion>NUM_OPCIONES) && opcion!=SALIDA);
    
            double v1, v2, error;
            ArrayList<ArrayList<Double>> m1, m2;
            int fil, col;
            String v;
    
            //Fase de pedir los datos
    
            switch(opcion){
                //Operadores binarios
                case 1:
                case 2:
                case 3:
                case 4:
                case 6:
                case 7:
                    System.out.println("Introduzca el primer valor: ");
                    v1=s.nextDouble();
    
                    System.out.println("Introduzca el otro valor: ");
                    v2=s.nextDouble();
                    break;
    
                //Operadores unarios
                case 5:
                case 8:
                case 9:
                    System.out.println("Introduzca el valor: ");
                    //scanf("%lf", &v1);
                    v1=s.nextDouble();
                    break;
    
                //Operaciones donde ambas matrices deben tener el mismo tamaño
                case 10:
                case 11:
                    System.out.println("Matriz num filas: ");
                    fil=s.nextInt();
    
                    System.out.println("Matriz columnas: ");
                    col=s.nextInt();
    
                    reservarMatrix(m1, fil, col);
                    reservarMatrix(m2, fil, col);
    
                    System.out.println("--------------------------------");
                    System.out.println("Primera matriz: ");
                    rellenarMatriz(m1);
    
                    System.out.println("--------------------------------");
                    System.out.println("Segunda matriz: ");
                    rellenarMatriz(m2);
    
                    System.out.println("-------------Operandos-------------------");
                    System.out.println("Primera matriz: ");
                    imprimirMatriz(m1);
    
                    System.out.println("--------------------------------");
                    System.out.println("\nSegunda matriz: ");
                    imprimirMatriz(m2);
    
                    System.out.println("--------------------------------");
    
                    break;
    
                case 12:
                    System.out.println("Filas Matriz 1: ");
                    fil=s.nextInt();
    
                    System.out.println("Columnas Matriz 1: ");
                    col=s.nextInt();
    
                    reservarMatrix(m1, fil, col);
                    reservarMatrix(m2, col, fil);
    
                    System.out.println("--------------------------------");
                    System.out.println("Primera matriz: ");
                    rellenarMatriz(m1);
    
                    System.out.println("--------------------------------");
                    System.out.println("Segunda matriz: ");
                    rellenarMatriz(m2);
    
                    System.out.println("-------------Operandos-------------------");
                    System.out.println("Primera matriz: ");
                    imprimirMatriz(m1);
    
                    System.out.println("--------------------------------");
                    System.out.println("\nSegunda matriz: ");
                    imprimirMatriz(m2);
    
                    System.out.println("--------------------------------");
                    break;
    
                case 13:
                    System.out.print("Introduzca expresion algebraica (c(): cos(), s(): sin(), t(): tan(), s(): sqrt(), e(), exp()): ");
                    v=s.nextLine();
                    
                    break;
    
                case 14:
                    System.out.print("Introduzca ecuacion en funcion de x (c(): cos(), s(): sin(), t(): tan(), s(): sqrt(), e(), exp()): ");
                    v=s.nextLine();
    
                    System.out.println("Introduzca el error: ");
                    error=s.nextDouble();
    
                    break;
    
                case 15:
                    System.out.println("Matriz num filas: ");
                    fil=s.nextInt();
    
                    System.out.println("Matriz columnas: ");
                    col=s.nextInt();
    
                    reservarMatrix(m1, fil, col);
    
                    System.out.println("--------------------------------");
                    
                    System.out.println("Matriz: ");
                    rellenarMatriz(m1);
    
                    System.out.println("-------------Operandos-------------------");
                    
                    System.out.println("Matriz: ");
                    imprimirMatriz(m1);
    
                    System.out.println("--------------------------------");
    
                    break;		
    
                default:
                System.out.println("Opcion no implementada");
                break;
            }
    
    
            //Fase de llamar a las funciones
            switch(opcion){
                case 1:
                    client.suma(v1, v2);
                    break;
    
                case 2:
                    client.resta(v1, v2);
                    break;
    
                case 3:
                    client.mult(v1, v2);
                    break;
    
                case 4:
                    client.division(v1, v2);
                    break;
    
                case 5:
                    client.raiz_cuadrada(v1)
                    break;
    
                case 6:
                    client.modulo(v1, v2);
                    break;
    
                case 7:
                    potencia_calculadora_1(v1, v2);
                    break;
    
                case 8:
                    esprimo_calculadora_1(v1);
                    break;
    
                case 9:			
                    factorial_calculadora_1(v1);
                    break;	
    
                case 10:
                    sumamatricial_calculadora_1(*m1, *m2);
    
                    liberarMatrix(&m1);
                    liberarMatrix(&m2);
                    break;
    
                case 11:
                    restamatricial_calculadora_1(*m1, *m2);
    
                    liberarMatrix(&m1);
                    liberarMatrix(&m2);
                    break;
    
                case 12:
                    multmatricial_calculadora_1(*m1, *m2);
    
                    liberarMatrix(&m1);
                    liberarMatrix(&m2);
                    break;
    
                case 13:
                    multiplescomandos_calculadora_1(v);
                    free(v);
                    v=NULL;
    
                    break;
    
                case 14:
                    resolverecuaciones_calculadora_1(v, error);
                    free(v);
                    v=NULL;
    
                case 15:
                    traspuesta_calculadora_1(*m1);
                    liberarMatrix(&m1);
                    break;
    
            }
            }while(opcion!=SALIDA);            

            transport.close();
        } catch (TTransportException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

    }
}