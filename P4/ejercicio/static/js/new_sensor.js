let url=document.URL.slice(0);

if((document.URL.lastIndexOf("/")-document.URL.indexOf("/"))>1){
    url=url.slice(0, document.URL.lastIndexOf("/"));
}

let socket=io.connect(url);


//IMPLEMENTAR SI DA TIEMPO FUNCION DE COMPROBACION
function enviar(){
	
    let res={
		id: null,   //Se le pone en el servidor
		sensorName: document.getElementById("sensor-name").value,
		name: document.getElementById("sensor-name").value.replaceAll(" ", "-"),
		unit: document.getElementById("unit").value,
		highWarningValue: parseInt(document.getElementById("high-warning-value").value),
		maxWarningMsg: document.getElementById("max-warning-msg").value,
		redValue: parseInt(document.getElementById("red-value").value),
		maxValue: parseInt(document.getElementById("max-value").value),

		lowWarningValue: parseInt(document.getElementById("low-warning-value").value),
		minWarningMsg: document.getElementById("min-warning-msg").value,
		blueValue: parseInt(document.getElementById("blue-value").value),
		minValue: parseInt(document.getElementById("min-value").value),
		imageDir: document.getElementById("image-dir").value,
		currentValue: 0,
    }

    socket.emit("add-sensor", res);
}