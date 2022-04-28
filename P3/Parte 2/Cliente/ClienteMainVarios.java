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
            int numClientes=Integer.parseInt(args[0]);
            // Crea el stub para el cliente especificando el nombre del servidor
            Registry mireg = LocateRegistry.getRegistry("localhost", 1099);
            
            IDonacionesExterno replica;

            if(Integer.parseInt(args[1])==0)
                replica = (IDonacionesExterno) mireg.lookup("S0");
            else
                replica = (IDonacionesExterno) mireg.lookup("S1");

            //IDonacionesExterno replica1 = (IDonacionesExterno) mireg.lookup("S1");


            int cont0=0, cont1=0;
            for(int i=0; i<numClientes; i++){
                String res="";
                if(Integer.parseInt(args[2])==0)
                    res=replica.registrarCliente(i);
                else
                    res=replica.registrarClienteInseguro(i);

                if(res.equals("S0"))
                    cont0++;
                else if(res.equals("S1"))
                    cont1++;
            }

            //System.out.println("SALIDA: ");
            System.out.println("#####################################");
            System.out.println("Registros en S0: "+cont0);
            System.out.println("Registros en S1: "+cont1);
            System.out.println("#####################################");
            //System.out.println("SALIDA: "+res);
            //replica = (IDonacionesExterno) mireg.lookup(res);

         } catch (NotBoundException | RemoteException e) {
            System.err.println("Exception del sistema: " + e);
        }
        System.exit(0);        
    }
}
