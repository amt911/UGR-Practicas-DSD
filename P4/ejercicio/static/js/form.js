let url=document.URL.slice(0);

if((document.URL.lastIndexOf("/")-document.URL.indexOf("/"))>1){
    url=url.slice(0, document.URL.lastIndexOf("/"));
}

let socket=io.connect(url);

function obtenerSensores(){
	socket.emit("obtener-sensores", true);
	//console.log("fallo")
}
socket.on("obtener-sensores", (data)=>{
	let select=document.getElementById("sensor");
	select.innerHTML="";

	for(let i=0; i<data.length; i++){
		//console.log("entro");
		let aux=document.createElement("option");
		aux.value=data[i].name;
		aux.innerHTML=data[i].sensorName;

		select.appendChild(aux);
	}
});

obtenerSensores();

//La funcion se ejecuta una vez
let valor=0;
function enviar(){
    let sensor=document.getElementById("sensor").value;
	valor=parseInt(document.getElementById("cuadro").value);

	socket.emit("obtener-sensor", sensor);		
}

socket.on("obtener-sensor", (data)=>{
	//data.currentValue=(valor>data.maxValue)? data.maxValue : valor;
	data.currentValue=valor;

	if(data.currentValue<data.minValue)
		data.currentValue=data.minValue;
		
	else if(data.currentValue>data.maxValue)
		data.currentValue=data.maxValue;


	console.log(valor)
	socket.emit("cambio-sensor", data);	
});
