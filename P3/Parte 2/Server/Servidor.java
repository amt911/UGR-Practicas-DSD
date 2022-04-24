package Server;

import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.util.ArrayList;

import Interfaces.AnilloServerI;
import Interfaces.ServerClientI;
import Interfaces.ServerServerI;

public class Servidor implements ServerClientI, ServerServerI{
    private static int numReplicas=0;
    public ArrayList<Integer> clientes;
    ArrayList<Integer> donacionesClientes;
    int idServer;
    boolean token;
    static int total=0;


    Servidor(){
        clientes=new ArrayList<>();
        idServer=numReplicas++;
        donacionesClientes=new ArrayList<>();

        //System.out.println("idserver: "+idServer);
        token=false;
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
    public synchronized String registrarCliente(int id) throws RemoteException {
        String res="";

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
    public synchronized void donar(int id, int cantidad) throws RemoteException {
        if(existeCliente(id)){
            AnilloServerI replica=obtenerReplicaAnillo(idServer);

            donacionesClientes.set(clientes.indexOf(id), donacionesClientes.get(clientes.indexOf(id))+cantidad);
    
            replica.solicitarToken();
            //Zona de exclusion mutua
            total+=cantidad;
            replica.liberarToken();
        }
        else{
            System.out.println("Lo siento, el usuario no se encuentra registrado");
        }
    }

    private AnilloServerI obtenerReplicaAnillo(int id){
        AnilloServerI replica=null;
        
        try {
            Registry mireg = LocateRegistry.getRegistry("localhost", 1099);
            replica = (AnilloServerI) mireg.lookup("A"+id);
        } catch (Exception e) {
            System.err.println("Exception:");
            e.printStackTrace();
        }

        return replica;
    }

    private ServerServerI obtenerReplica(int id){
        ServerServerI replica=null;
        
        try {
            Registry mireg = LocateRegistry.getRegistry("localhost", 1099);
            replica = (ServerServerI) mireg.lookup("S"+id);
        } catch (Exception e) {
            System.err.println("Exception:");
            e.printStackTrace();
        }

        return replica;
    }

    @Override
    public int totalDonado(int id) throws RemoteException {

        return total;
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
