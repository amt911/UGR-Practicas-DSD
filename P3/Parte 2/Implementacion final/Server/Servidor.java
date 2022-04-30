package Server;

import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.util.ArrayList;
import java.util.Map;
import java.util.TreeMap;

import Cliente.TransaccionesCliente;
import Interfaces.IDonacionesExterno;
import Interfaces.IDonacionesInterno;

public class Servidor implements IDonacionesExterno, IDonacionesInterno, Runnable{
    
    //Parte de los anillos
    private volatile boolean token;
    private volatile boolean solicitado;

    //Parte básica junto con historial de transacciones
    private int numReplicas=0;
    private Map<Integer, TransaccionesCliente> datosClientes=new TreeMap<>();
    private Map<Integer, String> credencialesClientes=new TreeMap<>();
    private ArrayList<Integer> clientesBloqueados=new ArrayList<>();

    private int idServer;
    private double subtotal=0;
    private String direccion;


    /**
     * Constructor de las réplicas.
     */
    Servidor(int id, int numReplicas){
        this(id, numReplicas, "localhost");
    }

    
    Servidor(int id, int numReplicas, String dir){
        idServer=id;
        this.numReplicas=numReplicas;
        token=false;

        if(idServer==0)
            token=true;
        else
            token=false;

        solicitado=false;

        direccion=dir;
    }


    @Override
    public boolean existeCliente(int id) throws RemoteException {
        //return clientes.contains(id);
        return datosClientes.containsKey(id);
    }


    /**
     * Permite comprobar si el cliente está registrado en alguna réplica.
     * @param idCliente Identificador del cliente que se desea buscar
     * @return Si está registrado o no.
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
    public String getContraseña(int id) throws RemoteException{
        return credencialesClientes.get(id);
    }


    boolean contraseñaCorrecta(int id, String passwd, String replicaId) throws RemoteException{
        boolean res=false;

        
        if(replicaId.equals("S"+idServer)){
            if(credencialesClientes.get(id).equals(passwd))
                res=true;
        }
        else{
            IDonacionesInterno replica=obtenerReplica(replicaId);

            if(replica.getContraseña(id).equals(passwd))
                res=true;
        }

        return res;
    }


    @Override
    public synchronized String registrarCliente(int id, String passwd) throws RemoteException {
        String res="";

        solicitarToken();
        if(!estaRegistradoCliente(id)){
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
                añadirCliente(id, passwd);
                res="S"+idMinimo;
            }
            else{
                IDonacionesInterno replica=obtenerReplica(idMinimo);
                replica.añadirCliente(id, passwd);
                res=replica.getNombreReplica();
            }
        }
        //En caso de estar registrado ya, simplemente se comprueba que los credenciales sean validos
        //En caso de serlos se devuelve a la replica en la que esta registrado
        else{
            res=buscarCliente(id);

            if(!contraseñaCorrecta(id, passwd, res))
                res="";
        }
        
        liberarToken();
        return res;
    }


    public synchronized String registrarClienteInseguro(int id, String passwd) throws RemoteException{
        String res="";

        //solicitarToken();
        if(!estaRegistradoCliente(id)){
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
                añadirCliente(id, passwd);
                res="S"+idMinimo;
            }
            else{
                IDonacionesInterno replica=obtenerReplica(idMinimo);
                replica.añadirCliente(id, passwd);
                res=replica.getNombreReplica();
            }
        }
        else{// if(contraseñaCorrecta(id, passwd))
            res=buscarCliente(id);

            if(!contraseñaCorrecta(id, passwd, res))
                res="";
        }
        
        //liberarToken();
        return res;
    }


    @Override
    public synchronized void donar(int id, String passwd, double cantidad) throws RemoteException {
        if(existeCliente(id) && contraseñaCorrecta(id, passwd, "S"+idServer) && !estaBloqueadoTodasReplicas(id)){
            //donacionesClientes.set(clientes.indexOf(id), donacionesClientes.get(clientes.indexOf(id))+cantidad);

            //Se inserta el map dentro de la seccion critica ya que almacena la hora de la transaccion
            //y puede darse el caso de que si esta fuera no encajen las horas
            solicitarToken();          
            datosClientes.get(id).insertarTransaccion(cantidad);
            //Zona de exclusion mutua
            subtotal+=cantidad;
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
            Registry mireg = LocateRegistry.getRegistry(direccion, 1099);
            replica = (IDonacionesInterno) mireg.lookup("S"+id);
        } catch (Exception e) {
            System.err.println("Exception:");
            e.printStackTrace();
        }

        return replica;
    }
    

    /**
     * Permite obtener la réplica con el identificador rmiregistry pasado por parámetro.
     * @param id Identificador rmiregistry de la réplica.
     * @return Una referencia al objeto remoto de la réplica correspondiente.
     */
    private IDonacionesInterno obtenerReplica(String id){
        IDonacionesInterno replica=null;
        
        try {
            Registry mireg = LocateRegistry.getRegistry(direccion, 1099);
            replica = (IDonacionesInterno) mireg.lookup(id);
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


    @Override
    public synchronized double totalDonado(int id, String passwd) throws RemoteException {
        double res=-1;

        if((existeCliente(id) && contraseñaCorrecta(id, passwd, "S"+idServer) && datosClientes.get(id).getCantidadTotal()>0 && !estaBloqueadoTodasReplicas(id)) || id<0){            
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


    @Override
    public int clientesSize() throws RemoteException {
        return datosClientes.size();
    }


    @Override
    public void añadirCliente(int id, String passwd) throws RemoteException {
        datosClientes.put(id, new TransaccionesCliente());
        credencialesClientes.put(id, passwd);
    }


    @Override
    public double totalDonadoCliente(int id, String passwd) throws RemoteException {
        double res=-1;

        if(existeCliente(id) && contraseñaCorrecta(id, passwd, "S"+idServer))
            res=datosClientes.get(id).getCantidadTotal();

        return res;
    }


    @Override
    public String getNombreReplica() throws RemoteException {
        return "S"+idServer;
    }


    @Override
    public synchronized void ponerACero(int id, String passwd) throws RemoteException {
        if(id<0 && existeCliente(id) && contraseñaCorrecta(id, passwd, "S"+idServer)){
            solicitarToken();
            subtotal=0;
            
            resetDonaciones();
            
            //Ahora para las replicas remotas
            for(int i=0; i<numReplicas; i++){
                if(i!=idServer){
                    IDonacionesInterno server=obtenerReplica(i);

                    server.resetDonaciones();
                }
            }
            liberarToken();
        }
        else{
            System.out.println("No es un cliente registrado");
        }
    }


    @Override
    public void resetDonaciones() throws RemoteException {
        //Var funciona de manera similar a auto en C++
        for(var aux: datosClientes.entrySet()){
            aux.getValue().reset();
        }
        subtotal=0;
    }


    /**
     * Pasa el token a la réplica siguiente
     */
    public void pasarToken() {
        token=false;
        IDonacionesInterno replica=obtenerReplica((idServer+1)%numReplicas);
        try {
            replica.setToken(true);
        } catch (RemoteException e) {
            e.printStackTrace();
        }
    }
    

    //Método usado para pasar el token en el algoritmo de exclusión mutua
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


    @Override
    public double getSubTotal() throws RemoteException {
        return subtotal;
    }


    @Override
    public String getTransacciones(int id, String passwd) throws RemoteException{
        String res="";

        if(existeCliente(id) && contraseñaCorrecta(id, passwd, "S"+idServer))
            res=datosClientes.get(id).getTransacciones();

        return res;
    }


    @Override
    public boolean estaBloqueado(int id) throws RemoteException{
        return clientesBloqueados.contains(id);
    }


    /**
     * Comprueba si el usuario esta bloqueado en alguna de las replicas.
     * Este metodo es seguro ya que se llama desde otros que ya son seguros.
     * @param id Identificador del cliente a buscar
     * @return True si esta bloqueado, false en otro caso.
     * @throws RemoteException
     */
    private boolean estaBloqueadoTodasReplicas(int id) throws RemoteException{
        boolean res=false;

        if(existeCliente(id)){
            res=estaBloqueado(id);
        }
        else{
            for(int i=0; i<numReplicas && !res; i++){
                if(i!=idServer){
                    IDonacionesInterno replica=obtenerReplica(i);

                    if(replica.estaBloqueado(id))
                        res=true;
                }
            }
        }

        return res;
    }


    @Override
    public synchronized boolean bloquearUsuario(int idAdmin, String passwd, int id) throws RemoteException {
        boolean res=false;

        solicitarToken();
        if(idAdmin<0 && id>=0 && existeCliente(idAdmin) && contraseñaCorrecta(idAdmin, passwd, "S"+idServer) && estaRegistradoCliente(id) && !estaBloqueadoTodasReplicas(id)){
            if(existeCliente(id)){
                addClienteBloqueado(id);
                res=true;
            }
            else{
                for(int i=0; i<numReplicas && !res; i++){
                    if(i!=idServer){
                        IDonacionesInterno replica=obtenerReplica(i);
                        
                        if(replica.existeCliente(id)){
                            replica.addClienteBloqueado(id);
                            res=true;
                        }
                    }
                }
            }
        }
        liberarToken();

        return res;
    }


    @Override
    public void addClienteBloqueado(int id) throws RemoteException{
        clientesBloqueados.add(id);
    }


    @Override
    public void deleteClienteBloqueado(int id) throws RemoteException{
        clientesBloqueados.remove(Integer.valueOf(id));
    }


    @Override
    public synchronized boolean desbloquearUsuario(int idAdmin, String passwd, int id) throws RemoteException{
        boolean res=false;

        solicitarToken();
        if(idAdmin<0 && id>=0 && existeCliente(idAdmin) && contraseñaCorrecta(idAdmin, passwd, "S"+idServer) && estaBloqueadoTodasReplicas(id)){
            if(existeCliente(id)){
                deleteClienteBloqueado(id);
                res=true;
            }
            else{
                for(int i=0; i<numReplicas && !res; i++){
                    if(i!=idServer){
                        IDonacionesInterno replica=obtenerReplica(i);

                        if(replica.existeCliente(id)){
                            res=true;
                            replica.deleteClienteBloqueado(id);
                        }
                    }
                }
            }
        }
        liberarToken();

        return res;
    }
}
