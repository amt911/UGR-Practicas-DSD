package Anillo;

import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import Interfaces.AnilloI;
import Interfaces.AnilloServerI;

public class Anillo implements AnilloI, AnilloServerI{
    public static int numInstancias=0;
    public boolean token;
    public int idAnillo;

    public Anillo(){
        idAnillo=numInstancias++;

        if(idAnillo==0)
            token=true;
    }

    @Override
    public void solicitarToken() throws RemoteException {
        while(!token){
            synchronized(this){
                try {
                    wait();
                } catch (InterruptedException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
            }
        }

        token=false;
    }

    @Override
    public void liberarToken() throws RemoteException {
        System.out.println("Liberando token: "+idAnillo);
        token=true;

        synchronized(this){
            notifyAll();
        }
    }

    @Override
    public void pasarToken() throws RemoteException {
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