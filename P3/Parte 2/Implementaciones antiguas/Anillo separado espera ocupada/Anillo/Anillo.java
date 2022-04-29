package Anillo;

import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;

import Interfaces.IAnilloInterno;
import Interfaces.IAnilloExterno;

public class Anillo implements IAnilloInterno, IAnilloExterno{
    public static int numInstancias=0;
    public volatile boolean token;
    public volatile boolean solicitado=false;
    public int idAnillo;

    public Anillo(){
        idAnillo=numInstancias++;

        if(idAnillo==0)
            token=true;
        else
            token=false;
    }


    @Override
    public void solicitarToken() throws RemoteException {
        solicitado=true;
        while(!token){}
    }

    @Override
    public void liberarToken() throws RemoteException {
        solicitado=false;
    }

    @Override
    public void pasarToken() throws RemoteException {
        if(token){
            while(solicitado){}
            token=false;

            IAnilloInterno replica=obtenerReplica((idAnillo+1)%numInstancias);
            replica.setToken(true);
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
