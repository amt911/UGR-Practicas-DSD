package Interfaces;

import java.rmi.Remote;
import java.rmi.RemoteException;
public interface IDonacionesInterno extends Remote {
    int clientesSize() throws RemoteException;
    boolean existeCliente(int id) throws RemoteException;
    void añadirCliente(int id) throws RemoteException;
    String getNombreReplica() throws RemoteException;
    void setDonacionesClientes(int id, int valor) throws RemoteException;
    //void pasarToken(int id) throws RemoteException;
    void setToken(boolean valor) throws RemoteException;
    boolean getToken() throws RemoteException;
}
