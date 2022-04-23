package Interfaces;

import java.rmi.Remote;
import java.rmi.RemoteException;

public interface AnilloServerI extends Remote{
    void solicitarAnillo() throws RemoteException;
    void liberarAnilllo() throws RemoteException;
}
