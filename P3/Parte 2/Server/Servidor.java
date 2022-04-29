package Server;

import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.util.Map;
import java.util.TreeMap;

import Cliente.TransaccionesCliente;
import Interfaces.IDonacionesExterno;
import Interfaces.IDonacionesInterno;

public class Servidor implements IDonacionesExterno, IDonacionesInterno, Runnable{
    
    //Parte de los anillos
    private volatile boolean token;
    private volatile boolean solicitado;




    //private static int numReplicas=0;
    private int numReplicas=0;
    private Map<Integer, TransaccionesCliente> datosClientes=new TreeMap<>();
    private Map<Integer, String> credencialesClientes=new TreeMap<>();
    private int idServer;
    private int subtotal=0;

    /**
     * Constructor de las réplicas.
     */
    Servidor(int id, int numReplicas){
        idServer=id;
        this.numReplicas=numReplicas;
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

    /**
     * Obtiene la contraseña de un cliente registrado
     * @param id Identificador del cliente.
     * @return La contraseña del cliente pasado como parámetro.
     */
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

    /**
     * Permite iniciar sesión de nuevo o registrar a un cliente en la réplica que menor número de clientes registrados tenga.
     * IMPORTANTE: Como es necesario saber el número de clientes registrados, valor que puede cambiar
     * concurrentemente, es necesario que sólo una réplica de todas ejecute este método a la vez.
     * Además es necesario que sea synchronized para clientes de una misma réplica.
     * 
     * @param id Identificador del cliente.
     * @param passwd Contraseña con la que se quiere registrar o credencial para iniciar sesion si esta registrado.
     * 
     * @return Devuelve el identificador de la réplica que ha sido asignada o en caso de solo
     * iniciar sesión, devuelve el identificador donde se encontraba. En caso de ser credenciales incorrectos se devuelve la 
     * cadena vacía
     */
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

    /**
     * Version insegura de registrar cliente, realiza exactamente lo mismo que la version segura,
     * pero es necesaria para realizar la comprobacion de que el algoritmo de los anillos funciona.
     * 
     * @param id Identificador del cliente que se quiere registrar/iniciar sesion
     * @param passwd Contraseña del cliente que, en caso de no estar registrado, es con la que se va
     * a registrar, en caso de iniciar sesion solo es un credencial mas
     * 
     * @return En caso de registro o de inicio de sesion valido, se devuelve el identificador de rmiregistry
     * de la replica a la que se debe conectar. En otro caso se devuelve la cadena vacia.
     */
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
    public synchronized void donar(int id, String passwd, int cantidad) throws RemoteException {
        if(existeCliente(id) && contraseñaCorrecta(id, passwd, "S"+idServer)){
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
            Registry mireg = LocateRegistry.getRegistry("localhost", 1099);
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
            Registry mireg = LocateRegistry.getRegistry("localhost", 1099);
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

    /**
     * Obtiene el total donado en todas las réplicas.
     * IMPORTANTE: Como este método tiene que acceder a atributos de otras réplicas 
     * que se pueden modificar concurrentemente, es necesario usar el algoritmo de 
     * sincronización en anillo. Además es necesario sincronizar la entrada de los 
     * clientes para una misma réplica con synchronized.
     * 
     * @param id Identificador del cliente que lo llama
     * @param passwd Contraseña del cliente
     * @return El total donado por todos los clientes de todas las réplicas. En caso de no estar
     * registrado, poner una contraseña incorrecta o no haber donado, se devuelve -1.
     */
    @Override
    public synchronized int totalDonado(int id, String passwd) throws RemoteException {
        int res=-1;

        if((existeCliente(id) && contraseñaCorrecta(id, passwd, "S"+idServer) && datosClientes.get(id).getCantidadTotal()>0) || id==-1){            
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
        return datosClientes.size();
    }

    /**
     * Permite añadir un cliente a la réplica que lo llama
     * @param id Identificador del cliente
     * @param passwd Contraseña del cliente
     */
    @Override
    public void añadirCliente(int id, String passwd) throws RemoteException {
        datosClientes.put(id, new TransaccionesCliente());
        credencialesClientes.put(id, passwd);
    }


    /**
     * Obtiene el total donado por el cliente que se pasa por parámetro.
     * @param id Identificador del cliente.
     * @return Entero con la cantidad que ha donado el cliente.
     */
    @Override
    public int totalDonadoCliente(int id, String passwd) throws RemoteException {
        int res=-1;

        if(existeCliente(id) && contraseñaCorrecta(id, passwd, "S"+idServer))
            res=datosClientes.get(id).getCantidadTotal();

        return res;
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
    public synchronized void ponerACero(int id, String passwd) throws RemoteException {
        if(existeCliente(id) && contraseñaCorrecta(id, passwd, "S"+idServer) && datosClientes.get(id).getCantidadTotal()>0){
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

    /**
     * Pone las donaciones de los clientes y el subtotal de la réplica a cero.
     * @throws RemoteException
     */
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
    
    /**
     * Método usado para pasar el token en el algoritmo de exclusión mutua
     */
    @Override
    public void run() {
        while(true){
            if(token && !solicitado){
                pasarToken();
            }
        }
    }

    /**
     * Modifica el valor del token al pasado por parámetro.
     * @param valor Valor que se pondrá en el token
     * @throws RemoteException
     */
    @Override
    public void setToken(boolean valor) throws RemoteException {
        token=valor;
    }

    /**
     * Obtiene el subtotal de la réplica.
     * @return Entero con el subtotal.
     * @throws RemoteException
     */
    @Override
    public int getSubTotal() throws RemoteException {
        return subtotal;
    }

    /**
     * Obtiene las transacciones del cliente identificado por el parámetro
     * @param id Identificador del cliente
     * @param passwd Contraseña del cliente.
     * @return En caso de no existir el cliente o tener los credenciales incorrectos
     * se devuelve una cadena vacía, en otro caso se devuelve el historial de transacciones.
     */
    public String getTransacciones(int id, String passwd) throws RemoteException{
        String res="";

        if(existeCliente(id) && contraseñaCorrecta(id, passwd, "S"+idServer))
            res=datosClientes.get(id).getTransacciones();

        return res;
    }
}
