package Interfaces;

import java.rmi.Remote;
import java.rmi.RemoteException;

public interface IDonacionesExterno extends Remote{
    String registrarCliente(int id, String passwd) throws RemoteException;
    String registrarClienteInseguro(int id, String passwd) throws RemoteException; 


    void donar(int id, String passwd, int cantidad) throws RemoteException;
    int totalDonado(int id, String passwd) throws RemoteException;
    int totalDonadoCliente(int id, String passwd) throws RemoteException;
    String getNombreReplica() throws RemoteException;
    void ponerACero(int id, String passwd) throws RemoteException;

    String getTransacciones(int id, String passwd) throws RemoteException;
}

