package Server;

import java.rmi.registry.*;
import java.rmi.server.*;
import java.util.ArrayList;

import Interfaces.IDonacionesExterno;

public class ServidorMain {
    public static void main(String [] args){
        if (System.getSecurityManager() == null) {
            System.setSecurityManager(new SecurityManager());
        }
        try {
            ArrayList<Servidor> replicas=new ArrayList<>();

            for(int i=0; i<Integer.parseInt(args[0]); i++){
                replicas.add(new Servidor(i, Integer.parseInt(args[0])));
            }

            Registry registry = LocateRegistry.getRegistry();
            ArrayList<IDonacionesExterno> stubs=new ArrayList<>();

            for(int i=0; i<Integer.parseInt(args[0]); i++){
                stubs.add((IDonacionesExterno) UnicastRemoteObject.exportObject(replicas.get(i), 0));
            }

            for(int i=0; i<Integer.parseInt(args[0]); i++){
                registry.rebind("S"+i, stubs.get(i));
            }

            ArrayList<Thread> hebras=new ArrayList<>();
            for(int i=0; i<Integer.parseInt(args[0]); i++){
                Thread aux=new Thread(replicas.get(i));
                hebras.add(aux);
                aux.start();
            }

            System.out.println("Lanzados los servidores de donacion");

            IDonacionesExterno s=(IDonacionesExterno) registry.lookup("S0");

            
            while(true){                
                System.out.println("---------------------------------------------------------------");
                System.out.println("Total donado: "+s.totalDonado(-1, "123"));
                System.out.println("---------------------------------------------------------------");

                Thread.sleep(500);
                System.out.print("\033[H\033[2J");
                System.out.flush();
            }
            
            
         

        } catch (Exception e) {
            System.err.println("Exception:");
            e.printStackTrace();
        }        
    }
}
