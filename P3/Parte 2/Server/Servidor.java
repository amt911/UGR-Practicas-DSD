package Server;

import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.util.ArrayList;

import Interfaces.ServerClientI;
import Interfaces.ServerServerI;

public class Servidor implements ServerClientI, ServerServerI{
    private static int numReplicas=0;
    int subtotal;
    public ArrayList<Integer> clientes;
    ArrayList<Integer> donacionesClientes;
    int idServer;


    Servidor(){
        subtotal=0;
        clientes=new ArrayList<>();
        idServer=numReplicas++;
        donacionesClientes=new ArrayList<>();

        System.out.println("idserver: "+idServer);
    }

    @Override
    public boolean existeCliente(int id) throws RemoteException {
        return clientes.contains(id);
    }


    boolean estaRegistradoCliente(int idCliente) throws RemoteException{
        boolean res=false;

        if(existeCliente(idCliente))
            res=true;

        else{
            for(int i=0; i<numReplicas && !res; i++){
                if(i!=idServer){
                    if(obtenerReplica(i).existeCliente(idCliente))
                        res=true;
                }   
            }
        }

        return res;
    }

    private String buscarCliente(int id) throws RemoteException{
        String res="";

        if(existeCliente(id))
            res="S"+idServer;
        
        else{
            boolean encontrado=false;
            for(int i=0; i<numReplicas && !encontrado; i++){
                if(i!=idServer){
                    ServerServerI aux=obtenerReplica(i);
                    //encontrado=aux.existeCliente(id);

                    //Es solo un igual para que se asigne y se compruebe en una sola instruccion
                    if(encontrado=aux.existeCliente(id)){
                        res="S"+i;
                    }
                }
            }
        }

        return res;
    }

    @Override
    public String registrarCliente(int id) throws RemoteException {
        String res="";
        //ServerServerI replica=obtenerReplica();

        //Obtenemos el minimo numero de clientes de las replicas y nos quedamos con su id
        int minimo=clientesSize();
        int idMinimo=idServer;
        for(int i=0;i<numReplicas;i++){
            if(i!=idServer){
                ServerServerI aux=obtenerReplica(i);
                if(aux.clientesSize()<minimo){
                    minimo=aux.clientesSize();
                    idMinimo=i;
                }
            }
        }


        if(!estaRegistradoCliente(id)){
            if(idMinimo==idServer){
                añadirCliente(id);
                res="S"+idMinimo;
            }
            else{
                ServerServerI replica=obtenerReplica(idMinimo);
                replica.añadirCliente(id);
                res=replica.getNombreReplica();
            }
        }
        else
            res=buscarCliente(id);

        return res;
    }

    @Override
    public void donar(int id, int cantidad) throws RemoteException {
        if(existeCliente(id)){
            donacionesClientes.set(clientes.indexOf(id), donacionesClientes.get(clientes.indexOf(id))+cantidad);
            subtotal+=cantidad;
            System.out.println("SUPUESTA DONACION: "+totalDonado(id));
        }
        else{
            System.out.println("Lo siento, el usuario no se encuentra registrado");
        }
    }

    private ServerServerI obtenerReplica(int id){
        ServerServerI micontador=null;
        
            //String replica=(nombreServidor=="S1")?"S2":"S1";
            try {
                Registry mireg = LocateRegistry.getRegistry("localhost", 1099);
                micontador = (ServerServerI) mireg.lookup("S"+id);

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
        
        if(existeCliente(id) && donacionesClientes.get(clientes.indexOf(id))>0){
            res=obtenerSubtotal();

            for(int i=0; i<numReplicas; i++){
                if(i!=idServer)
                    res+=obtenerReplica(i).obtenerSubtotal();
            }
        }

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
        return "S"+idServer;
    }    
}
