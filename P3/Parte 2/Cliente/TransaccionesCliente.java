package Cliente;

import java.time.Instant;
import java.util.ArrayList;

public class TransaccionesCliente {
    private int cantidadTotal=0;
    //private Instant fecha;
    //Supongo que pueden darse dos transacciones en el mismo instante, por lo que tiene mas sentido un pair en vez de map
    private ArrayList<Instant> instanteTransacciones=new ArrayList<>();
    private ArrayList<Integer> cantidadTransacciones=new ArrayList<>();

    public int getCantidadTotal(){
        return cantidadTotal;
    }

    public void insertarTransaccion(int cantidad){
        instanteTransacciones.add(Instant.now());
        cantidadTransacciones.add(cantidad);

        cantidadTotal+=cantidad;
    }

    public void reset(){
        instanteTransacciones.clear();
        cantidadTransacciones.clear();
        cantidadTotal=0;
    }
}
