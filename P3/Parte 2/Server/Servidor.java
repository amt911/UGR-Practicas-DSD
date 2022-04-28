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
    private ArrayList<Integer> clientes;
    private ArrayList<Integer> donacionesClientes;
    private int idServer;
    private int subtotal=0;
    //private static int donacionesRealizadas=0;

    /**
     * Constructor de las réplicas.
     */
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

    /**
     * Comprueba si el cliente está registrado en la réplica en la que se llama.
     * @param id Identificador del cliente
     * @return Si está registrado el cliente o no.
     */
    @Override
    public boolean existeCliente(int id) throws RemoteException {
        return clientes.contains(id);
    }

    /**
     * Permite comprobar si el cliente está registrado en alguna réplica
     * @param idCliente Identificador del cliente que se desea buscar
     * @return Si está registrado o no.
     * @throws RemoteException
     */
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

    /**
     * Busca al cliente dado por el identificador en todas las réplicas.
     * 
     * @param id Identificador del cliente.
     * @return Identificador de la réplica en la que se encuentra en la forma de id de rmiregistry.
     * @throws RemoteException
     */
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

    /**
     * Permite iniciar sesión de nuevo o registrar a un cliente en la réplica que menor número de clientes registrados tenga.
     * IMPORTANTE: Como es necesario saber el número de clientes registrados, valor que puede cambiar
     * concurrentemente, es necesario que sólo una réplica de todas ejecute este método a la vez.
     * Además es necesario que sea synchronized para clientes de una misma réplica.
     * 
     * @param id Identificador del cliente.
     * 
     * @return Devuelve el identificador de la réplica que ha sido asignada o en caso de solo
     * iniciar sesión, devuelve el identificador donde se encontraba.
     */
    @Override
    public synchronized String registrarCliente(int id) throws RemoteException {
        String res="";
        /*
        solicitarToken();
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
*/

        if(!estaRegistradoCliente(id)){
            solicitarToken();
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
            
            if(idMinimo==idServer){
                añadirCliente(id);
                res="S"+idMinimo;
            }
            else{
                IDonacionesInterno replica=obtenerReplica(idMinimo);
                replica.añadirCliente(id);
                res=replica.getNombreReplica();
            }
            liberarToken();
        }
        else
            res=buscarCliente(id);

        return res;
    }

    /**
     * Permite donar una cantidad a la réplica en la que el cliente está suscrito
     * IMPORTANTE: Es necesario sincronizar el acceso a esta variable ya que pueden estar
     * intentando acceder desde otro objeto concurrentemente, por lo que es necesario 
     * usar el algoritmo en anillo. También es necesario hacerlo synchronized para garantizar
     * la integridad entre varias donaciones a una misma réplica.
     * 
     * @param id Identificador del cliente, debe existir en la reṕlica
     * @param cantidad Cantidad que desea donar el cliente.
     */
    @Override
    public synchronized void donar(int id, int cantidad) throws RemoteException {
        if(existeCliente(id)){
            donacionesClientes.set(clientes.indexOf(id), donacionesClientes.get(clientes.indexOf(id))+cantidad);
    
            solicitarToken();          
            //Zona de exclusion mutua
            subtotal+=cantidad;
            //donacionesRealizadas++;
            liberarToken();
        }
        else{
            System.out.println("Lo siento, el usuario no se encuentra registrado");
        }
    }

    /**
     * Permite obtener la réplica remota con el identificador pasado por parámetro.
     * (Este método solo sirve para la propia clase, por lo que no está en las interfaces)
     * @param id Entero con el número de la réplica.
     * @return Una referencia remota a la réplica solicitada.
     */
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

    /**
     * Solicitud del token por un cliente para acceder a la sección crítica
     */
    private void solicitarToken(){
        solicitado=true;
        while(!token){}
    }

    /**
     * Liberación del token por parte de un cliente
     */
    private void liberarToken(){
        solicitado=false;
    }

    /**
     * Obtiene el total donado en todas las réplicas.
     * IMPORTANTE: Como este método tiene que acceder a atributos de otras réplicas 
     * que se pueden modificar concurrentemente, es necesario usar el algoritmo de 
     * sincronización en anillo. Además es necesario sincronizar la entrada de los 
     * clientes para una misma réplica con synchronized.
     * 
     * @param id Identificador del cliente que lo llama
     * @return El total donado por todos los clientes de todas las réplicas.
     */
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
            liberarToken();
        }
        
        return res;
    }

    /**
     * Obtiene el número de clientes registrados en esa réplica
     * @return Entero con dicha cantidad.
     */
    @Override
    public int clientesSize() throws RemoteException {
        return clientes.size();
    }

    /**
     * Permite añadir un cliente a la réplica que lo llama
     * @param id Identificador del cliente
     */
    @Override
    public void añadirCliente(int id) throws RemoteException {
        clientes.add(id);
        donacionesClientes.add(0);
    }


    /**
     * Obtiene el total donado por el cliente que se pasa por parámetro.
     * @param id Identificador del cliente.
     * @return Entero con la cantidad que ha donado el cliente.
     */
    @Override
    public int totalDonadoCliente(int id) throws RemoteException {
        return donacionesClientes.get(clientes.indexOf(id));
    }

    /**
     * Obtiene el nombre de la réplica que lo llama tal y como aparece en rmiregistry
     * @return String con dicho identificador.
     */
    @Override
    public String getNombreReplica() throws RemoteException {
        return "S"+idServer;
    }

    /**
     * Pone a cero todas las réplicas del servidor de donaciones.
     * IMPORTANTE: Como debe acceder a distintos atributos de otras replicas, es necesario usar el algoritmo en anillo para asegurar la integridad.
     * @param id Identificador del cliente que solicita la llamada
     */
    @Override
    public synchronized void ponerACero(int id) throws RemoteException {
        if(existeCliente(id) && donacionesClientes.get(clientes.indexOf(id))>0){
            solicitarToken();
            subtotal=0;
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

    //@Override
    //public synchronized int getNumDonacionesRealizadas() throws RemoteException {
    //    return donacionesRealizadas;
    //}
}
