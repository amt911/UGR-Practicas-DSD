package Cliente;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;

public class TransaccionesCliente {
    private int cantidadTotal=0;

    //Supongo que pueden darse dos transacciones en el mismo instante, por lo que tiene mas sentido un pair en vez de map
    private ArrayList<ZonedDateTime> instanteTransacciones=new ArrayList<>();
    private ArrayList<Integer> cantidadTransacciones=new ArrayList<>();

    /**
     * Obtiene la cantidad donada total por un cliente
     * @return La cantidad donada
     */
    public int getCantidadTotal(){
        return cantidadTotal;
    }

    /**
     * Crea una transacción nueva con la cantidad donada.
     * @param cantidad La cantidad a donar.
     */
    public void insertarTransaccion(int cantidad){
        instanteTransacciones.add(ZonedDateTime.now());
        cantidadTransacciones.add(cantidad);

        cantidadTotal+=cantidad;
    }

    /**
     * Borra todo el historial de transacciones y pone la cantidad total a 0.
     */
    public void reset(){
        instanteTransacciones.clear();
        cantidadTransacciones.clear();
        cantidadTotal=0;
    }

    /**
     * Obtiene el historial de transacciones un formato más presentable
     * @return El historial de transacciones.
     */
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
