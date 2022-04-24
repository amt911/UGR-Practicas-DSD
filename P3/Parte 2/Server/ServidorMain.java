package Server;

import java.rmi.registry.*;
import java.rmi.server.*;
import java.util.ArrayList;

import Anillo.Anillo;
import Interfaces.AnilloI;
import Interfaces.AnilloServerI;
import Interfaces.ServerClientI;

public class ServidorMain {
    public static void main(String [] args){
        if (System.getSecurityManager() == null) {
            System.setSecurityManager(new SecurityManager());
        }
        try {
            ArrayList<ServerClientI> replicas=new ArrayList<>();

            for(int i=0; i<Integer.parseInt(args[0]); i++){
                replicas.add(new Servidor());
            }

            Registry registry = LocateRegistry.getRegistry();
            ArrayList<ServerClientI> stubs=new ArrayList<>();

            for(int i=0; i<Integer.parseInt(args[0]); i++){
                stubs.add((ServerClientI) UnicastRemoteObject.exportObject(replicas.get(i), 0));
            }

            for(int i=0; i<Integer.parseInt(args[0]); i++){
                registry.rebind("S"+i, stubs.get(i));
            }

            System.out.println("Lanzados los servidores de donacion");

            ArrayList<Anillo> replicasAnillos=new ArrayList<>();
            
            for(int i=0; i<Integer.parseInt(args[0]); i++){
                replicasAnillos.add(new Anillo());
            }
            

            //Ahora toca exportar los anillos externos
            ArrayList<AnilloServerI> stubsAnillosExternos=new ArrayList<>();

            for(int i=0; i<Integer.parseInt(args[0]); i++){
                stubsAnillosExternos.add((AnilloServerI) UnicastRemoteObject.exportObject(replicasAnillos.get(i), 0));
            }

            for(int i=0; i<Integer.parseInt(args[0]); i++){
                registry.rebind("A"+i, stubsAnillosExternos.get(i));
            }

            System.out.println("Lanzados los servidores de anillos externos");                        
            
            ServerClientI s=(ServerClientI) registry.lookup("S0");
            int contador=0;
            while(true){
                System.out.println("---------------------------------------------------------------");
                for(int i=0; i<Integer.parseInt(args[0]); i++){
                    System.out.println("Anillo "+replicasAnillos.get(i).getID()+": "+replicasAnillos.get(i).getToken());
                }
                //System.out.println("---------------------------------------------------------------");
                contador=(contador+1)%Anillo.numInstancias;
                AnilloI replica = (AnilloI) registry.lookup("A"+contador);                
                replica.pasarToken();
                Thread.sleep(200);

                System.out.println("---------------------------------------------------------------");
                System.out.println("Total donado: "+s.totalDonado(0));
                System.out.println("---------------------------------------------------------------");

            }
        } catch (Exception e) {
            System.err.println("Exception:");
            e.printStackTrace();
        }        
    }
}
