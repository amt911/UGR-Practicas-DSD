package Server;

import java.rmi.registry.*;
import java.rmi.server.*;
import java.util.ArrayList;

import Anillo.Anillo;
import Interfaces.IAnilloExterno;
import Interfaces.IAnilloInterno;
import Interfaces.IDonacionesExterno;

public class ServidorMain {
    public static void main(String [] args){
        if (System.getSecurityManager() == null) {
            System.setSecurityManager(new SecurityManager());
        }
        try {
            ArrayList<Servidor> replicas=new ArrayList<>();

            for(int i=0; i<Integer.parseInt(args[0]); i++){
                replicas.add(new Servidor());
            }

            Registry registry = LocateRegistry.getRegistry();
            ArrayList<IDonacionesExterno> stubs=new ArrayList<>();

            for(int i=0; i<Integer.parseInt(args[0]); i++){
                stubs.add((IDonacionesExterno) UnicastRemoteObject.exportObject(replicas.get(i), 0));
            }

            for(int i=0; i<Integer.parseInt(args[0]); i++){
                registry.rebind("S"+i, stubs.get(i));
            }


            for(int i=0; i<Integer.parseInt(args[0]); i++){
                Thread aux=new Thread(replicas.get(i));
                aux.start();
            }

            System.out.println("Lanzados los servidores de donacion");

            IDonacionesExterno s=(IDonacionesExterno) registry.lookup("S0");
            String res=s.registrarCliente(-1);
            s=(IDonacionesExterno) registry.lookup(res);
            int contador=0;
            while(true){
                System.out.println("---------------------------------------------------------------");
                for(int i=0; i<Integer.parseInt(args[0]); i++){
                    System.out.println("Servidor "+replicas.get(i).getNombreReplica()+": "+replicas.get(i).getToken());
                }

                //contador=(contador+1)%Anillo.numInstancias;
                //IAnilloExterno replica = (IAnilloExterno) registry.lookup("A"+contador);                
                //replica.pasarToken();
                
                System.out.println("---------------------------------------------------------------");
                System.out.println("Total donado: "+s.totalDonado(-1));
                System.out.println("---------------------------------------------------------------");
                
                Thread.sleep(500);
                System.out.print("\033[H\033[2J");
                System.out.flush();
            }
/*
            ArrayList<Anillo> replicasAnillos=new ArrayList<>();
            
            for(int i=0; i<Integer.parseInt(args[0]); i++){
                replicasAnillos.add(new Anillo());
            }
            

            //Ahora toca exportar los anillos externos
            ArrayList<IAnilloInterno> stubsAnillosExternos=new ArrayList<>();

            for(int i=0; i<Integer.parseInt(args[0]); i++){
                stubsAnillosExternos.add((IAnilloInterno) UnicastRemoteObject.exportObject(replicasAnillos.get(i), 0));
            }

            for(int i=0; i<Integer.parseInt(args[0]); i++){
                registry.rebind("A"+i, stubsAnillosExternos.get(i));
            }

            
            System.out.println("Lanzados los servidores de anillos externos");                        
            
            IDonacionesExterno s=(IDonacionesExterno) registry.lookup("S0");
            String res=s.registrarCliente(-1);
            s=(IDonacionesExterno) registry.lookup(res);
            int contador=0;
            while(true){
                System.out.println("---------------------------------------------------------------");
                for(int i=0; i<Integer.parseInt(args[0]); i++){
                    System.out.println("Anillo "+replicasAnillos.get(i).getID()+": "+replicasAnillos.get(i).getToken());
                }

                contador=(contador+1)%Anillo.numInstancias;
                IAnilloExterno replica = (IAnilloExterno) registry.lookup("A"+contador);                
                replica.pasarToken();
                //Thread.sleep(200);

                System.out.println("---------------------------------------------------------------");
                System.out.println("Total donado: "+s.totalDonado(-1));
                System.out.println("---------------------------------------------------------------");

            }
            */
        } catch (Exception e) {
            System.err.println("Exception:");
            e.printStackTrace();
        }        
    }
}
