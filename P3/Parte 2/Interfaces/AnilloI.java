package Interfaces;

import java.rmi.Remote;
import java.rmi.RemoteException;

public interface AnilloI extends Remote{
    void pasarAnillo() throws RemoteException;
    void setToken(boolean valor) throws RemoteException;
    int getID() throws RemoteException;
    boolean getToken() throws RemoteException;
}
