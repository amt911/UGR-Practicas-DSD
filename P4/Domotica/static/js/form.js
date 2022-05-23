// Esta parte obtiene la URL base para realizar peticiones
let url=arreglarURL(document.URL);
//-----------------------------------------------------------

let socket=io.connect(url);

let sensores=[];

/**
 * Obtiene todos los nombres de los sensores y los añade al select
 */
socket.on("obtener-sensores", (data)=>{
	sensores=[...data];

	let select=document.getElementById("sensor");
	select.innerHTML="";

	for(let i=0; i<data.length; i++){
		let aux=document.createElement("option");
		aux.value=data[i].name;
		aux.innerHTML=data[i].sensorName;

		select.appendChild(aux);
	}
});

let valor=0;

/**
 * Permite enviar la confirmacion del nuevo valor
 */
function enviar(){
    let sensor=document.getElementById("sensor").value;
	valor=parseInt(document.getElementById("cuadro").value, 10);
	console.log(valor)

	
	let sensorObj=sensores.find(i=>i.name==sensor);

	socket.emit("cambio-sensor", {id: sensorObj.id, currentValue: valor});
}

/**
 * Cuando obtiene el sensor le cambia el valor
 */
/*
socket.on("obtener-sensor", (data)=>{
	data.currentValue=valor;

	if(data.currentValue<data.minValue)
		data.currentValue=data.minValue;
		
	else if(data.currentValue>data.maxValue)
		data.currentValue=data.maxValue;

	socket.emit("cambio-sensor", data);	
});
*/