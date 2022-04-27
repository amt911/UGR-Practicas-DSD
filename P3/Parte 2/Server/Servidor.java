package Server;

import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.util.ArrayList;

import Interfaces.IDonacionesExterno;
import Interfaces.IDonacionesInterno;

public class Servidor implements IDonacionesExterno, IDonacionesInterno, Runnable{
    
    //Parte de los anillos
    private volatile boolean token;
    private volatile boolean solicitado;




    private static int numReplicas=0;
    public ArrayList<Integer> clientes;
    ArrayList<Integer> donacionesClientes;
    int idServer;
    private int subtotal=0;
    private static int donacionesRealizadas=0;


    Servidor(){
        clientes=new ArrayList<>();
        idServer=numReplicas++;
        donacionesClientes=new ArrayList<>();
        token=false;

        if(idServer==0)
            token=true;
        else
            token=false;

        solicitado=false;
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
                    IDonacionesInterno aux=obtenerReplica(i);
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
                IDonacionesInterno aux=obtenerReplica(i);
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
                IDonacionesInterno replica=obtenerReplica(idMinimo);
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
            donacionesClientes.set(clientes.indexOf(id), donacionesClientes.get(clientes.indexOf(id))+cantidad);
    
            solicitarToken();          
            //Zona de exclusion mutua
            subtotal+=cantidad;
            donacionesRealizadas++;
            liberarToken();
        }
        else{
            System.out.println("Lo siento, el usuario no se encuentra registrado");
        }
    }

    private IDonacionesInterno obtenerReplica(int id){
        IDonacionesInterno replica=null;
        
        try {
            Registry mireg = LocateRegistry.getRegistry("localhost", 1099);
            replica = (IDonacionesInterno) mireg.lookup("S"+id);
        } catch (Exception e) {
            System.err.println("Exception:");
            e.printStackTrace();
        }

        return replica;
    }

    private void solicitarToken(){
        solicitado=true;
        while(!token){}
    }

    private void liberarToken(){
        solicitado=false;
    }

    @Override
    public synchronized int totalDonado(int id) throws RemoteException {
        int res=-1;
        if((existeCliente(id) && donacionesClientes.get(clientes.indexOf(id))>0) || id==-1){
            solicitarToken();
            res=subtotal;

            for(int i=0; i<numReplicas; i++){
                if(i!=idServer){
                    IDonacionesInterno aux=obtenerReplica(i);
                    res+=aux.getSubTotal();
                }
            }
            //res=total;
            liberarToken();
        }
        
        return res;
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

    @Override
    public void donarInseguro(int id, int cantidad) throws RemoteException {
        if(existeCliente(id)){
            donacionesClientes.set(clientes.indexOf(id), donacionesClientes.get(clientes.indexOf(id))+cantidad);
            donacionesRealizadas++;
            subtotal+=cantidad;
        }
        else{
            System.out.println("Lo siento, el usuario no se encuentra registrado");
        }
    }

    @Override
    public synchronized void ponerACero(int id) throws RemoteException {
        if(existeCliente(id) && donacionesClientes.get(clientes.indexOf(id))>0){
            solicitarToken();
            subtotal=0;
            donacionesRealizadas=0;
            //Zona de exclusion mutua
            for(int i=0; i<donacionesClientes.size(); i++)
                donacionesClientes.set(i, 0);
            

            //Ahora para las replicas remotas
            for(int i=0; i<numReplicas; i++){
                if(i!=id){
                    IDonacionesInterno server=obtenerReplica(i);

                    for(int j=0; j<server.clientesSize(); j++)
                        server.setDonacionesClientes(j, 0);
                }
            }
            liberarToken();
        }
        else{
            System.out.println("No es un cliente registrado");
        }
    }

    @Override
    public void setDonacionesClientes(int id, int valor) throws RemoteException {
        donacionesClientes.set(id, valor);
    }

    public void pasarToken() {
        token=false;
        IDonacionesInterno replica=obtenerReplica((idServer+1)%numReplicas);
        try {
            replica.setToken(true);
        } catch (RemoteException e) {
            e.printStackTrace();
        }
    }
    

    @Override
    public void run() {
        while(true){
            if(token && !solicitado){
                pasarToken();
            }
        }
    }

    @Override
    public void setToken(boolean valor) throws RemoteException {
        token=valor;
    }    

    public boolean getToken(){
        return token;
    }

    @Override
    public int getSubTotal() throws RemoteException {
        return subtotal;
    }

    @Override
    public synchronized int getNumDonacionesRealizadas() throws RemoteException {
        return donacionesRealizadas;
    }
}
