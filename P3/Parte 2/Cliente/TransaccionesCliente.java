package Cliente;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;

public class TransaccionesCliente {
    private int cantidadTotal=0;

    //Supongo que pueden darse dos transacciones en el mismo instante, por lo que tiene mas sentido un pair en vez de map
    private ArrayList<ZonedDateTime> instanteTransacciones=new ArrayList<>();
    private ArrayList<Integer> cantidadTransacciones=new ArrayList<>();

    public int getCantidadTotal(){
        return cantidadTotal;
    }

    public void insertarTransaccion(int cantidad){
        instanteTransacciones.add(ZonedDateTime.now());
        cantidadTransacciones.add(cantidad);

        cantidadTotal+=cantidad;
    }

    public void reset(){
        instanteTransacciones.clear();
        cantidadTransacciones.clear();
        cantidadTotal=0;
    }

    public String getTransacciones(){
        String res="";

        DateTimeFormatter f=DateTimeFormatter.ofPattern("dd/MM/yyyy - HH:mm:ss");
        
        for(int i=0; i<instanteTransacciones.size(); i++){
            res+="######################################################\n"+
                "Fecha de la transaccion: "+instanteTransacciones.get(i).format(f)+
                "\nCantidad donada: "+cantidadTransacciones.get(i)+"\n";
        }
        res+="######################################################\n";

        return res;
    }
}
