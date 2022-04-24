package Anillo;

import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import Interfaces.AnilloI;
import Interfaces.AnilloServerI;

public class Anillo implements AnilloI, AnilloServerI{
    public static int numInstancias=0;
    public volatile boolean token;
    public int idAnillo;

    public Anillo(){
        idAnillo=numInstancias++;

        if(idAnillo==0)
            token=true;
        else
            token=false;
    }

    @Override
    public synchronized void solicitarToken() throws RemoteException {
        while(!token){
            //synchronized(this){}
            System.out.println("Identificador anillo: "+idAnillo);
        }

        token=false;
        //setToken(false);
    }

    @Override
    public synchronized void liberarToken() throws RemoteException {
        token=true;
    }

    @Override
    public synchronized void pasarToken() throws RemoteException {
        if(token){
            token=false;

            AnilloI replica=obtenerReplica((idAnillo+1)%numInstancias);
            replica.setToken(true);
        }
    }

    @Override
    public void setToken(boolean valor) throws RemoteException {
        token=valor;
    }

    private AnilloI obtenerReplica(int id){
        AnilloI replica=null;

        try {
            Registry mireg = LocateRegistry.getRegistry("localhost", 1099);
            replica = (AnilloI) mireg.lookup("A"+id);

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