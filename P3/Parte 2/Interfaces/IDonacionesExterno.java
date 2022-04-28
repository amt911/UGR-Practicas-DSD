package Interfaces;

import java.rmi.Remote;
import java.rmi.RemoteException;

import Cliente.TransaccionesCliente;

public interface IDonacionesExterno extends Remote{
    String registrarCliente(int id) throws RemoteException;
    String registrarClienteInseguro(int id) throws RemoteException;    
    void donar(int id, int cantidad) throws RemoteException;
    int totalDonado(int id) throws RemoteException;
    int totalDonadoCliente(int id) throws RemoteException;
    String getNombreReplica() throws RemoteException;
    void ponerACero(int id) throws RemoteException;

    String getTransacciones(int id) throws RemoteException;
}

