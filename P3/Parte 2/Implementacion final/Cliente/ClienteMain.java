package Cliente;

import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.util.Scanner;

import Interfaces.IDonacionesExterno;

import java.rmi.*;


public class ClienteMain {
    final static int SALIDA=-1;
    final static int SALIDA_LOGIN=6;
    public static void main(String[] args) throws InterruptedException{
        // Crea e instala el gestor de seguridad
        if (System.getSecurityManager() == null) {
            System.setSecurityManager(new SecurityManager());
        }
        try {
            String direccion=(args.length==0)? "localhost" : args[0];
            Scanner donacion=new Scanner(System.in);

            // Crea el stub para el cliente especificando el nombre del servidor

            Registry mireg = LocateRegistry.getRegistry(direccion, 1099);
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
                System.out.println("3.- Poner a cero la cantidad donada (solo por usuarios con id<0)");
                System.out.println("4.- Bloquear usuario (solo por usuarios con id<0)");
                System.out.println("5.- Desbloquear usuario (solo por usuarios con id<0)");
                System.out.println("6.- Cerrar la sesión del cliente actual");
                System.out.println(SALIDA+" .- Salir del programa");
                System.out.print("Seleccione una opcion: ");
                opcion=donacion.nextInt();

                switch(opcion){
                    case 1:{
                        double cantidad;
                        do{
                            System.out.print("Introduzca cantidad a donar: ");
                            cantidad=donacion.nextDouble();
                            donacion.nextLine();

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
                        System.out.print("Introduzca id usuario: ");
                        int idBan=donacion.nextInt();
                        donacion.nextLine();

                        boolean salida=replica.bloquearUsuario(id, passwd, idBan);

                        if(salida)
                            System.out.println("Operacion realizada con exito");
                        else
                            System.out.println("Operacion no realizada, puede que sea un administrador, que el usuario no exista o que este ya bloqueado");

                        break;
                    }
                    
                    case 5:{
                        System.out.print("Introduzca id usuario: ");
                        int idUnban=donacion.nextInt();
                        donacion.nextLine();

                        boolean salida=replica.desbloquearUsuario(id, passwd, idUnban);

                        if(salida)
                            System.out.println("Operacion realizada con exito");
                        else
                            System.out.println("Operacion no realizada, puede que sea un administrador, que el usuario no exista o que este ya desbloqueado");

                        break;                    
                    }

                    case SALIDA_LOGIN:{
                        System.out.println("Cerrando la sesion del usuario "+id);
                        break;
                    }

                    default:
                    break;
                }
            }while(opcion!=SALIDA && opcion!=SALIDA_LOGIN);
        }
        }while(opcion!=SALIDA);
        } catch (NotBoundException | RemoteException e) {
            System.err.println("Exception del sistema: " + e);
        }
        System.exit(0);        
    }
}
