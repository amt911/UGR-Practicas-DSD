import java.rmi.registry.*;
import java.rmi.server.*;

public class ServidorMain {
    public static void main(String [] args){
        if (System.getSecurityManager() == null) {
            System.setSecurityManager(new SecurityManager());
        }
        try {
            //Registry reg = LocateRegistry.createRegistry(1099);
            ServerClientI replica1 = new Servidor("S1");
            ServerClientI replica2 = new Servidor("S2");
            ServerClientI stub1 = (ServerClientI) UnicastRemoteObject.exportObject(replica1, 0);
            ServerClientI stub2 = (ServerClientI) UnicastRemoteObject.exportObject(replica2, 0);
            Registry registry = LocateRegistry.getRegistry();
            registry.rebind("S1", stub1);
            registry.rebind("S2", stub2);

            System.out.println("Lanzados los servidores de donacion");
        } catch (Exception e) {
            System.err.println("Exception:");
            e.printStackTrace();
        }        
    }
}