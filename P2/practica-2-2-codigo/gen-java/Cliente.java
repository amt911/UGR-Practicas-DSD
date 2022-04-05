import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

import org.apache.thrift.TException;
import org.apache.thrift.transport.TSSLTransportFactory;
import org.apache.thrift.transport.TTransport;
import org.apache.thrift.transport.TTransportException;
import org.apache.thrift.transport.TSocket;
import org.apache.thrift.transport.TSSLTransportFactory.TSSLTransportParameters;
import org.apache.thrift.*;
import org.apache.thrift.protocol.TBinaryProtocol;
import org.apache.thrift.protocol.TProtocol;

public class Cliente{
    public static void main(String [] args) throws TException{
            TTransport transport;
            transport = new TSocket("localhost", 9090);
            TProtocol protocol=new TBinaryProtocol(transport);
            Calculadora.Client client=new Calculadora.Client(protocol);

            transport.open();

            Scanner s=new Scanner(System.in);
            final int SALIDA=100;
            final int NUM_OPCIONES=16;
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
                    System.out.println("13.- Traspuesta de una matriz");
                    System.out.println("14.- Calculo de una cadena de operaciones respetando la jerarquia de operaciones");
                    System.out.println("15.- Resolver ecuaciones de la forma ...=0");
                    System.out.println("16.- Producto escalar de dos vectores");
                    System.out.println(SALIDA+".- Salir del programa");
                    System.out.print("Introduzca la opcion: ");

                    opcion=s.nextInt();
                    s.nextLine();
                    
                    if((opcion<1 || opcion>NUM_OPCIONES) && opcion!=SALIDA)
                        System.out.println("Opcion incorrecta");
                }while((opcion<1 || opcion>NUM_OPCIONES) && opcion!=SALIDA);
    
            double v1=-1, v2=-1, error=-1, inf=0, sup=0;
            List<List<Double>> m1=new ArrayList<>(), m2=new ArrayList<>();
            int fil=-1, col=-1;
            String v=new String();

            List<List<Double>> salidaList=null;
            double salidaDouble=-1;
            String salidaString=null;
            boolean salidaBool=false;

    
            //Fase de pedir los datos
    
            switch(opcion){
                //Operadores binarios
                case 1:
                case 2:
                case 3:
                case 4:
                case 6:
                case 7:
                    System.out.print("Introduzca el primer valor: ");
                    v1=s.nextDouble();
                    s.nextLine();

                    System.out.print("Introduzca el otro valor: ");
                    v2=s.nextDouble();
                    s.nextLine();
                    break;
    
                //Operadores unarios
                case 5:
                case 8:
                case 9:
                    System.out.print("Introduzca el valor: ");
                    //scanf("%lf", &v1);
                    v1=s.nextDouble();
                    s.nextLine();
                    break;
    
                //Operaciones donde ambas matrices deben tener el mismo tamaño
                case 10:
                case 11:
                    System.out.print("Matriz num filas: ");
                    fil=s.nextInt();
                    s.nextLine();
    
                    System.out.print("Matriz columnas: ");
                    col=s.nextInt();
                    s.nextLine();
    
                    System.out.println("--------------------------------");
                    System.out.println("Primera matriz: ");
                    
                    for(int i=0; i<fil; i++){
                        List<Double> aux=new ArrayList<>();
                        for(int j=0; j<col; j++){
                            aux.add(0.0);
                        }
                        m1.add(aux);
                    }

                    rellenarMatriz(m1);
    
                    System.out.println("--------------------------------");
                    System.out.println("Segunda matriz: ");

                    for(int i=0; i<fil; i++){
                        List<Double> aux=new ArrayList<>();
                        for(int j=0; j<col; j++){
                            aux.add(0.0);
                        }
                        m2.add(aux);
                    }

                    rellenarMatriz(m2);
    
                    System.out.println("-------------Operandos-------------------");
                    System.out.println("Primera matriz: ");
                    imprimirMatriz(m1);
    
                    System.out.println("--------------------------------");
                    System.out.println("Segunda matriz: ");
                    imprimirMatriz(m2);
    
                    System.out.println("--------------------------------");
    
                    break;
    
                case 12:
                    System.out.print("Filas Matriz 1: ");
                    fil=s.nextInt();
                    s.nextLine();
    
                    System.out.print("Columnas Matriz 1: ");
                    col=s.nextInt();
                    s.nextLine();
    
                    System.out.println("--------------------------------");
                    System.out.println("Primera matriz: ");

                    for(int i=0; i<fil; i++){
                        List<Double> aux=new ArrayList<>();
                        for(int j=0; j<col; j++){
                            aux.add(0.0);
                        }
                        m1.add(aux);
                    }                    

                    rellenarMatriz(m1);
    
                    System.out.println("--------------------------------");
                    System.out.println("Segunda matriz: ");

                    for(int i=0; i<col; i++){
                        List<Double> aux=new ArrayList<>();
                        for(int j=0; j<fil; j++){
                            aux.add(0.0);
                        }
                        m2.add(aux);
                    }                    

                    rellenarMatriz(m2);
    
                    System.out.println("-------------Operandos-------------------");
                    System.out.println("Primera matriz: ");
                    imprimirMatriz(m1);
    
                    System.out.println("--------------------------------");
                    System.out.println("Segunda matriz: ");
                    imprimirMatriz(m2);
    
                    System.out.println("--------------------------------");
                    break;
    
                case 14:
                    System.out.print("Introduzca expresion algebraica (c(): cos(), s(): sin(), t(): tan(), s(): sqrt(), e(): exp()): ");
                    v=s.nextLine();
                    
                    break;
    
                case 15:
                    System.out.print("Introduzca ecuacion en funcion de x (c(): cos(), s(): sin(), t(): tan(), s(): sqrt(), e(): exp()): ");
                    v=s.nextLine();
    
                    System.out.print("Introduzca el error: ");
                    error=s.nextDouble();
                    s.nextLine();

                    System.out.print("Introduzca el extremo inferior del intervalo (donde se sospecha que puede estar la solucion): ");
                    inf=s.nextDouble();
                    s.nextLine();

                    System.out.print("Introduzca el extremo superior del intervalo (donde se sospecha que puede estar la solucion): ");
                    sup=s.nextDouble();     
                    s.nextLine();
                    break;
    
                case 13:
                    System.out.print("Matriz num filas: ");
                    fil=s.nextInt();
                    s.nextLine();
    
                    System.out.print("Matriz columnas: ");
                    col=s.nextInt();
                    s.nextLine();
    
                    System.out.println("--------------------------------");
                    
                    System.out.println("Matriz: ");

                    
                    for(int i=0; i<fil; i++){
                        List<Double> aux=new ArrayList<>();
                        for(int j=0; j<col; j++){
                            aux.add(0.0);
                        }
                        m1.add(aux);
                    }

                    rellenarMatriz(m1);
    
                    System.out.println("-------------Operandos-------------------");
                    
                    System.out.println("Matriz: ");
                    imprimirMatriz(m1);
    
                    System.out.println("--------------------------------");
    
                    break;		
    
                case 16:
                System.out.print("Numero de elementos de los vectores: ");
                col=s.nextInt();
                s.nextLine();

                System.out.println("--------------------------------");
                System.out.println("Primer vector: ");

                for(int i=0; i<1; i++){
                    List<Double> aux=new ArrayList<>();
                    for(int j=0; j<col; j++){
                        aux.add(0.0);
                    }
                    m1.add(aux);
                }                    

                rellenarMatriz(m1);

                System.out.println("--------------------------------");
                System.out.println("Segundo vector: ");

                for(int i=0; i<col; i++){
                    List<Double> aux=new ArrayList<>();
                    for(int j=0; j<1; j++){
                        aux.add(0.0);
                    }
                    m2.add(aux);
                }                    

                rellenarMatriz(m2);

                System.out.println("-------------Operandos-------------------");
                System.out.println("Primer vector: ");
                imprimirMatriz(m1);

                System.out.println("--------------------------------");
                System.out.println("Segundo vector: ");
                imprimirMatriz(m2);

                System.out.println("--------------------------------");
                break;                


                default:
                System.out.println("Opcion no implementada");
                break;
            }
            //Fase de llamar a las funciones
            switch(opcion){
                case 1:
                    salidaDouble=client.suma(v1, v2);
                    break;
    
                case 2:
                salidaDouble=client.resta(v1, v2);
                    break;
    
                case 3:
                salidaDouble=client.mult(v1, v2);
                    break;
    
                case 4:
                salidaDouble=client.division(v1, v2);
                    break;
    
                case 5:
                salidaDouble=client.raiz_cuadrada(v1);
                    break;
    
                case 6:
                salidaDouble=client.modulo((long)v1, (long) v2);
                    break;
    
                case 7:
                    salidaDouble=client.potencia((long) v1, (long) v2);
                    break;
    
                case 8:
                    salidaBool=client.es_primo((long) v1);
                    break;
    
                case 9:			
                    salidaDouble=client.factorial((long) v1);
                    break;	
    
                case 10:
                    salidaList=client.suma_matricial(m1, m2);
                    break;
    
                case 11:
                    salidaList=client.resta_matricial(m1, m2);
                    break;
    
                case 12:
                case 16:
                    salidaList=client.mult_matricial(m1, m2);
                    break;
                    
                case 13:
                    salidaList=client.traspuesta(m1);
                    break;

                case 14:
                    salidaDouble=client.multiples_comandos(v, -1);
                    break;
    
                case 15:
                    salidaString=client.biseccion(v, error, inf, sup);
                    break;
            }


            switch(opcion){
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 9:
                case 14:
                System.out.println("#######################################################");
                System.out.println("El resultado de la operacion es: "+salidaDouble);
                System.out.println("#######################################################") ;
                break;

                case 8:
                System.out.println("#######################################################");
                System.out.println("El resultado de la operacion es: "+salidaBool);
                System.out.println("#######################################################") ;
                break;                

                case 10:
                case 11:
                case 12:
                case 13:
                case 16:
                    System.out.println("#######################################################");
                    System.out.println("La operacion matricial/vectorial da como resultado: ");
                    imprimirMatriz(salidaList);
                    System.out.println("#######################################################");
                    break;

                case 15:
                System.out.println("#######################################################");
                System.out.println("El resultado de la operacion es: "+salidaString);
                System.out.println("#######################################################") ;
                break;
            }
            }while(opcion!=SALIDA);            

            transport.close();
    }

    private static void rellenarMatriz(List<List<Double>> m){
        Scanner s=new Scanner(System.in);
        
        System.out.println("Introduzca los valores: ");

        for(int i=0; i<m.size(); i++){
            for(int j=0; j<m.get(i).size(); j++){
                m.get(i).set(j, s.nextDouble());
                s.nextLine();
            }
        }
    }

    private static void imprimirMatriz(List<List<Double>> m){
        for(List<Double> aux: m){
            for(Double valor: aux)
                System.out.print(""+valor+" ");

            System.out.print("\n");
        }
    }
}