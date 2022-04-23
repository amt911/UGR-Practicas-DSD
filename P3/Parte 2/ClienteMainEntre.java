import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.rmi.*;


public class ClienteMainEntre {
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
            ServerClientI replica = (ServerClientI) mireg.lookup("S0");
            String res=replica.registrarCliente(id);
            System.out.println("SALIDA: "+res);
            replica = (ServerClientI) mireg.lookup(res);

            for(int i=0; i<1000; i++){
                replica.donar(id, 1);
            }
                
        } catch (NotBoundException | RemoteException e) {
            System.err.println("Exception del sistema: " + e);
        }
        System.exit(0);        
    }
}
