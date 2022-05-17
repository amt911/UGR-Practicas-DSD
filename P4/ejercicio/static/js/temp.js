let url=document.URL.slice(0);

if((document.URL.lastIndexOf("/")-document.URL.indexOf("/"))>1){
    url=url.slice(0, document.URL.lastIndexOf("/"));
}

let socket=io.connect(url);

function enviar(){
    let valor=document.getElementById("cuadro").value;
    //socket.emit('cambio-temp', {evento: "temperatura", valor: valor, fecha: new Date()});
    socket.emit("cambio-sensor", 	{
		id: 1,
		name: "temperatura",
        unit: "°C",
		warningValue: 30,
		warningMsg: "Temperatura peligrosamente alta, considere tomar medidas",
		maxValue: 40,
		imageDir: null,
		currentValue: valor,
		deviceState: false
	});
}