// Esta parte obtiene la URL base para realizar peticiones
let url=arreglarURL(document.URL);
//----------------------------------------------------------

let socket=io.connect(url);

/**
 * Obtiene la lista de sensores que se pueden eliminar
 */
socket.on("obtener-sensores", (data)=>{
	let select=document.getElementById("sensor");
	select.innerHTML="";

	//Prohibimos eliminar los originales
	for(let i=3; i<data.length; i++){
		let aux=document.createElement("option");
		aux.innerHTML=data[i].name;

		select.appendChild(aux);
	}	
})

/**
 * Permite enviar la eleccion del sensor a eliminar
 */
function enviar(){
	let sensor=document.getElementById("sensor").value;

	if(sensor!="")
    	socket.emit("delete-sensor", sensor);
}