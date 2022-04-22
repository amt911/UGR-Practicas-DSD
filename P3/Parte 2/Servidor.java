import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.util.ArrayList;

public class Servidor implements ServerClientI, ServerServerI{
    int subtotal;
    public ArrayList<Integer> clientes;
    ArrayList<Integer> donacionesClientes;
    String nombreServidor;


    Servidor(String nombre){
        subtotal=0;
        clientes=new ArrayList<>();
        nombreServidor=nombre;
        donacionesClientes=new ArrayList<>();
    }

    @Override
    public boolean existeCliente(int id) throws RemoteException {
        return clientes.contains(id);
    }

    @Override
    public String registrarCliente(int id) throws RemoteException {
        String res="";
        ServerServerI replica=obtenerReplica();

        if(!existeCliente(id) && !replica.existeCliente(id)){
            if(clientes.size()<=replica.clientesSize() ){
                añadirCliente(id);
                res=nombreServidor;
            }
            else{
                replica.añadirCliente(id);
                res=replica.getNombreReplica();
            }
        }
        else if(replica.existeCliente(id)){
            res=replica.getNombreReplica();
        }
        else if(existeCliente(id)){
            res=nombreServidor;
        }

        return res;
    }

    @Override
    public synchronized void donar(int id, int cantidad) throws RemoteException {
        if(existeCliente(id)){
            donacionesClientes.set(clientes.indexOf(id), donacionesClientes.get(clientes.indexOf(id))+cantidad);
            subtotal+=cantidad;
            System.out.println("SUPUESTA DONACION: "+totalDonado(id));
        }
        else{
            System.out.println("Lo siento, el usuario no se encuentra registrado");
        }
    }

    private ServerServerI obtenerReplica(){
        ServerServerI micontador=null;
        
            String replica=(nombreServidor=="S1")?"S2":"S1";
            try {
                Registry mireg = LocateRegistry.getRegistry("localhost", 1099);
                micontador = (ServerServerI) mireg.lookup(replica);

                //res=obtenerSubtotal()+micontador.obtenerSubtotal();
            } catch (Exception e) {
                System.err.println("Ejemplo exception:");
                e.printStackTrace();
            }
            //}
        return micontador;
    }

    @Override
    public int totalDonado(int id) throws RemoteException {
        int res=-1;
        
        if(existeCliente(id) && donacionesClientes.get(clientes.indexOf(id))>0)
            res=obtenerSubtotal()+obtenerReplica().obtenerSubtotal();

        return res;
    }


    //ServerServerI
    @Override
    public int obtenerSubtotal() throws RemoteException {
        return subtotal;
    }

    @Override
    public int clientesSize() throws RemoteException {
        return clientes.size();
    }

    @Override
    public void añadirCliente(int id) throws RemoteException {
        clientes.add(id);
        donacionesClientes.add(0);
    }

    @Override
    public int totalDonadoCliente(int id) throws RemoteException {
        return donacionesClientes.get(clientes.indexOf(id));
    }

    @Override
    public String getNombreReplica() throws RemoteException {
        return nombreServidor;
    }

    @Override
    public void ponerACero() throws RemoteException {
        System.out.println("Poniendo a cero...");
        ServerServerI s=obtenerReplica();
        s.ponerACero();
    }    
}
