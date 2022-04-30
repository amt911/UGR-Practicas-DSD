package Interfaces;

import java.rmi.Remote;
import java.rmi.RemoteException;

public interface IDonacionesExterno extends Remote{
    /**
     * Permite iniciar sesión de nuevo o registrar a un cliente en la réplica que menor número de clientes registrados tenga.
     * Esta versión es segura para varios clientes concurrentes.
     * 
     * @param id Identificador del cliente.
     * @param passwd Contraseña con la que se quiere registrar o credencial para iniciar sesion si esta registrado.
     * 
     * @return Devuelve el identificador de la réplica que ha sido asignada o en caso de solo
     * iniciar sesión, devuelve el identificador donde se encontraba. En caso de ser credenciales incorrectos se devuelve la 
     * cadena vacía
     */    
    String registrarCliente(int id, String passwd) throws RemoteException;


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
    String registrarClienteInseguro(int id, String passwd) throws RemoteException; 


    /**
     * Permite donar una cantidad a la réplica en la que el cliente está suscrito
     * Es segura para varios clientes concurrentes.
     * 
     * @param id Identificador del cliente, debe existir en la reṕlica
     * @param cantidad Cantidad que desea donar el cliente.
     */
    void donar(int id, String passwd, double cantidad) throws RemoteException;


    /**
     * Obtiene el total donado en todas las réplicas.
     * Es seguro con varios clientes concurrentes.
     * 
     * @param id Identificador del cliente que lo llama
     * @param passwd Contraseña del cliente
     * @return El total donado por todos los clientes de todas las réplicas. En caso de no estar
     * registrado, poner una contraseña incorrecta o no haber donado, se devuelve -1.
     */    
    double totalDonado(int id, String passwd) throws RemoteException;


    /**
     * Obtiene el total donado por el cliente que se pasa por parámetro.
     * @param id Identificador del cliente.
     * @param passwd Contraseña del cliente.
     * @return Entero con la cantidad que ha donado el cliente.
     */    
    double totalDonadoCliente(int id, String passwd) throws RemoteException;


    /**
     * Obtiene el nombre de la réplica que lo llama tal y como aparece en rmiregistry
     * @return String con dicho identificador.
     */    
    String getNombreReplica() throws RemoteException;


    /**
     * Pone a cero todas las réplicas del servidor de donaciones.
     * Es segura para varios clientes concurrentes.
     * 
     * @param id Identificador del cliente que solicita la llamada
     */    
    void ponerACero(int id, String passwd) throws RemoteException;

    /**
     * Obtiene las transacciones del cliente identificado por el parámetro
     * @param id Identificador del cliente
     * @param passwd Contraseña del cliente.
     * @return En caso de no existir el cliente o tener los credenciales incorrectos
     * se devuelve una cadena vacía, en otro caso se devuelve el historial de transacciones.
     */
    String getTransacciones(int id, String passwd) throws RemoteException;


    /**
     * Permite bloquear a un usuario por mala conducto (o por otros motivos).
     * Esta operación solo la pueden realizar los administradores que estén 
     * registrados en el sistema (aquellos con identificador menor que 0).
     * @param idAdmin Identificador del administrador que va a bloquear
     * @param passwd Contraseña del administrador
     * @param id Identificador del usuario a bloquear
     * @return True si la operación ha tenido éxito y false en otro caso.
     * @throws RemoteException
     */
    boolean bloquearUsario(int idAdmin, String passwd, int id) throws RemoteException;
}

