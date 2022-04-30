package Cliente;

import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;

import Interfaces.IDonacionesExterno;

import java.rmi.*;


public class ClienteMainVarios {
    final static int SALIDA=-1;
    public static void main(String[] args) throws InterruptedException{
        // Crea e instala el gestor de seguridad
        if (System.getSecurityManager() == null) {
            System.setSecurityManager(new SecurityManager());
        }
        try {
            int id=Integer.parseInt(args[0]);
            // Crea el stub para el cliente especificando el nombre del servidor
            Registry mireg = LocateRegistry.getRegistry("localhost", 1099);
            IDonacionesExterno replica = (IDonacionesExterno) mireg.lookup("S0");
            String res=replica.registrarCliente(id);
            System.out.println("SALIDA: "+res);
            replica = (IDonacionesExterno) mireg.lookup(res);

            for(int i=0; i<1000; i++){
                replica.donar(id, 1);
            }

            System.out.println("######################################");
            System.out.println("Ya se ha ejecutado por el proceso: "+args[0]);
            System.out.println("######################################");                
        } catch (NotBoundException | RemoteException e) {
            System.err.println("Exception del sistema: " + e);
        }
        System.exit(0);        
    }
}
