package Interfaces;

import java.rmi.Remote;
import java.rmi.RemoteException;
public interface IDonacionesInterno extends Remote {
    int clientesSize() throws RemoteException;
    boolean existeCliente(int id) throws RemoteException;
    void añadirCliente(int id) throws RemoteException;
    String getNombreReplica() throws RemoteException;
    void resetDonaciones() throws RemoteException;
    void setToken(boolean valor) throws RemoteException;
    int getSubTotal() throws RemoteException;
}
