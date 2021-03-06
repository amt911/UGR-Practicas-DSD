package Anillo;

import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import Interfaces.IAnilloInterno;
import Interfaces.IAnilloExterno;

public class Anillo implements IAnilloInterno, IAnilloExterno{
    public static int numInstancias=0;
    public volatile boolean token;
    public volatile boolean solicitado=false;
    public int idAnillo;
    Lock lock=new ReentrantLock();
    Condition sinToken=lock.newCondition();
    Condition conSolicitud=lock.newCondition();

    public Anillo(){
        idAnillo=numInstancias++;

        if(idAnillo==0)
            token=true;
        else
            token=false;
    }


    @Override
    public void solicitarToken() throws RemoteException {
        lock.lock();
        try {
            solicitado = true;
            while (!token) {
                try {
                    sinToken.await();
                } catch (InterruptedException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
            }
        } finally {
            lock.unlock();
        }
        // token=false;
    }

    @Override
    public void liberarToken() throws RemoteException {
        // token=true;
        lock.lock();
        try {
            solicitado = false;
            conSolicitud.signalAll();
        } finally {
            lock.unlock();
        }
    }

    @Override
    public void pasarToken() throws RemoteException {
        lock.lock();
        try {
            if (token) {
                while (solicitado) {
                    sinToken.signalAll();
                    try {
                        conSolicitud.await();
                    } catch (InterruptedException e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }
                }
                token = false;

                IAnilloInterno replica = obtenerReplica((idAnillo + 1) % numInstancias);
                replica.setToken(true);
            }
        } finally {
            lock.unlock();
        }
    }


    @Override
    public void setToken(boolean valor) throws RemoteException {
        token=valor;
    }

    private IAnilloInterno obtenerReplica(int id){
        IAnilloInterno replica=null;

        try {
            Registry mireg = LocateRegistry.getRegistry("localhost", 1099);
            replica = (IAnilloInterno) mireg.lookup("A"+id);

        } catch (Exception e) {
            System.err.println("Ejemplo exception:");
            e.printStackTrace();
        }

        return replica;
    }

    @Override
    public int getID() throws RemoteException {
        return idAnillo;
    }

    @Override
    public boolean getToken() throws RemoteException {
        return token;
    }
}
