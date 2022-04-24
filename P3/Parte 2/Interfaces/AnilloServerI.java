package Interfaces;

import java.rmi.Remote;
import java.rmi.RemoteException;

public interface AnilloServerI extends Remote{
    void solicitarToken() throws RemoteException;
    void liberarToken() throws RemoteException;
}
