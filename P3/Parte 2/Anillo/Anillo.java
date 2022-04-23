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
    public void solicitarAnillo() throws RemoteException {
        while(!token){
            //System.out.println("Esperando a que se libere el token");
            System.out.println("id: "+idAnillo);
        }
        
        token=false;
    }

    @Override
    public void liberarAnilllo() throws RemoteException {
        System.out.println("Liberando token: "+idAnillo);
        token=true;
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
        
            //String replica=(nombreServidor=="S1")?"S2":"S1";
            try {
                Registry mireg = LocateRegistry.getRegistry("localhost", 1099);
                replica = (AnilloI) mireg.lookup("A"+id);

                //res=obtenerSubtotal()+micontador.obtenerSubtotal();
            } catch (Exception e) {
                System.err.println("Ejemplo exception:");
                e.printStackTrace();
            }
            //}
        return replica;
    }

    @Override
    public int getID() throws RemoteException {
        // TODO Auto-generated method stub
        return idAnillo;
    }

    @Override
    public boolean getToken() throws RemoteException {
        // TODO Auto-generated method stub
        return token;
    }
}
