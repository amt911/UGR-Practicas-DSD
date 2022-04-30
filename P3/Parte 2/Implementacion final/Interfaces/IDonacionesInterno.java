package Interfaces;

import java.rmi.Remote;
import java.rmi.RemoteException;
public interface IDonacionesInterno extends Remote {
    /**
     * Obtiene el número de clientes registrados en esa réplica
     * @return Entero con dicha cantidad.
     */
    int clientesSize() throws RemoteException;


    /**
     * Comprueba si el cliente está registrado en la réplica en la que se llama.
     * @param id Identificador del cliente
     * @return Si está registrado el cliente o no.
     */    
    boolean existeCliente(int id) throws RemoteException;


    /**
     * Permite añadir un cliente a la réplica que lo llama.
     * @param id Identificador del cliente
     * @param passwd Contraseña del cliente
     */
    void añadirCliente(int id, String passwd) throws RemoteException;


    /**
     * Obtiene el nombre de la réplica que lo llama tal y como aparece en rmiregistry
     * @return String con dicho identificador.
     */
    String getNombreReplica() throws RemoteException;


    /**
     * Pone las donaciones de los clientes y el subtotal de la réplica a cero.
     * @throws RemoteException
     */
    void resetDonaciones() throws RemoteException;


    /**
     * Modifica el valor del token al pasado por parámetro.
     * @param valor Valor que se pondrá en el token
     * @throws RemoteException
     */
    void setToken(boolean valor) throws RemoteException;


    /**
     * Obtiene el subtotal de la réplica.
     * @return Entero con el subtotal.
     * @throws RemoteException
     */
    double getSubTotal() throws RemoteException;


    /**
     * Obtiene la contraseña de un cliente registrado
     * @param id Identificador del cliente.
     * @return La contraseña del cliente pasado como parámetro.
     */
    String getContraseña(int id) throws RemoteException;

    /**
     * Añade un cliente a la lista de usuarios bloqueados
     * @param id Identificador del cliente
     * @throws RemoteException
     */
    void addClienteBloqueado(int id) throws RemoteException;

    /**
     * Comprueba si el usuario esta bloqueado en la replica en la que se llama.
     * @param id Identificador del cliente a buscar
     * @return True si esta bloqueado, false si no lo esta.
     * @throws RemoteException
     */
    boolean estaBloqueado(int id) throws RemoteException;

    /**
     * Elimina del ArrayList al cliente bloqueado.
     * @param id Identificador del cliente
     * @throws RemoteException
     */
    void deleteClienteBloqueado(int id) throws RemoteException;
}
