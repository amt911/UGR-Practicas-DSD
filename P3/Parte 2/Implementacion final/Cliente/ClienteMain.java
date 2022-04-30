package Cliente;

import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.util.Scanner;

import Interfaces.IDonacionesExterno;

import java.rmi.*;


public class ClienteMain {
    final static int SALIDA=-1;
    public static void main(String[] args) throws InterruptedException{
        // Crea e instala el gestor de seguridad
        if (System.getSecurityManager() == null) {
            System.setSecurityManager(new SecurityManager());
        }
        try {
            Scanner donacion=new Scanner(System.in);

            // Crea el stub para el cliente especificando el nombre del servidor
            Registry mireg = LocateRegistry.getRegistry("localhost", 1099);
            IDonacionesExterno replica = (IDonacionesExterno) mireg.lookup("S0");

            
            int opcion=0;
            do{
            System.out.print("Introduzca identificador para registrarse/iniciar sesion (mayor o igual a 0): ");
            int id=donacion.nextInt();
            donacion.nextLine();
            System.out.print("Contraseña: ");
            String passwd=donacion.nextLine();

            //Con este metodo se inicia sesion de nuevo y ademas dice en que replica se encuentra
            String res=replica.registrarCliente(id, passwd);

            if(res.equals("")){
                System.out.println("Lo sentimos, pero la contraseña no es correcta");
            }
            else{
            replica = (IDonacionesExterno) mireg.lookup(res);

            do{
                System.out.println("----------------------------------------------------");
                System.out.println("Cliente: "+id);
                System.out.println("Cantidad donada: "+replica.totalDonadoCliente(id, passwd));
                System.out.println("Conectado a replica: "+replica.getNombreReplica());
                System.out.println("Cantidad total servidor: "+replica.totalDonado(id, passwd));
                System.out.println("----------------------------------------------------");

                System.out.println("Opciones: ");
                System.out.println("1.- Donar");
                System.out.println("2.- Obtener historial de transacciones");
                System.out.println("3.- Poner a cero la cantidad donada");
                System.out.println("4.- Cerrar la sesión del cliente actual");
                System.out.println(SALIDA+" .- Salir del programa");
                System.out.print("Seleccione una opcion: ");
                opcion=donacion.nextInt();

                switch(opcion){
                    case 1:{
                        double cantidad;
                        do{
                            System.out.print("Introduzca cantidad a donar: ");
                            cantidad=donacion.nextDouble();

                            if(cantidad<0)
                                System.out.println("Cantidad invalida");
                        }while(opcion<0);

                        replica.donar(id, passwd, cantidad);
                        break;
                    }

                    case 2:{
                        System.out.println("\n"+replica.getTransacciones(id, passwd));
                        
                        break;
                    }

                    case 3:{
                        replica.ponerACero(id, passwd);
                        break;
                    }

                    case 4:{
                        System.out.println("Cerrando la sesion del usuario "+id);
                        break;
                    }

                    default:
                    break;
                }
            }while(opcion!=SALIDA && opcion!=4);
        }
        }while(opcion!=SALIDA);
        } catch (NotBoundException | RemoteException e) {
            System.err.println("Exception del sistema: " + e);
        }
        System.exit(0);        
    }
}
