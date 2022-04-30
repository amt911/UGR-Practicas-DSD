package Cliente;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;

public class TransaccionesCliente {
    private double cantidadTotal=0;

    //Como supongo que puede haber dos transacciones en el mismo instante (aunque sea casi imposible),
    //necesito usar un multimap, pero como no esta implementado lo hago con dos arrays.
    private ArrayList<ZonedDateTime> instanteTransacciones=new ArrayList<>();
    private ArrayList<Double> cantidadTransacciones=new ArrayList<>();

    /**
     * Obtiene la cantidad donada total por un cliente
     * @return La cantidad donada
     */
    public double getCantidadTotal(){
        return cantidadTotal;
    }

    /**
     * Crea una transacción nueva con la cantidad donada.
     * @param cantidad La cantidad a donar.
     */
    public void insertarTransaccion(double cantidad){
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
