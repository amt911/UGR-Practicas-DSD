package Interfaces;

import java.rmi.Remote;
import java.rmi.RemoteException;

public interface IDonacionesExterno extends Remote{
    String registrarCliente(int id) throws RemoteException;
    void donar(int id, int cantidad) throws RemoteException;
    int totalDonado(int id) throws RemoteException;
    int totalDonadoCliente(int id) throws RemoteException;
    String getNombreReplica() throws RemoteException;
    //void ponerACero() throws RemoteException;
}
