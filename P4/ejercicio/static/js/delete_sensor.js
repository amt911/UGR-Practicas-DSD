let url=document.URL.slice(0);

if((document.URL.lastIndexOf("/")-document.URL.indexOf("/"))>1){
    url=url.slice(0, document.URL.lastIndexOf("/"));
}

let socket=io.connect(url);

socket.emit("obtener-sensores", true);

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

//IMPLEMENTAR SI DA TIEMPO FUNCION DE COMPROBACION
function enviar(){
	let sensor=document.getElementById("sensor").value;
    socket.emit("delete-sensor", sensor);
}