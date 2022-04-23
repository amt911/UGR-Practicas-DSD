package Interfaces;

import java.rmi.Remote;
import java.rmi.RemoteException;

public interface ServerServerI extends Remote {
    int obtenerSubtotal() throws RemoteException;
    int clientesSize() throws RemoteException;
    boolean existeCliente(int id) throws RemoteException;
    void añadirCliente(int id) throws RemoteException;
    String getNombreReplica() throws RemoteException;
    //void ponerACero() throws RemoteException;
}
