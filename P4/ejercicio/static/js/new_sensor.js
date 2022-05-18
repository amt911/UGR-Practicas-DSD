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
		highWarningValue: parseFloat(document.getElementById("high-warning-value").value),
		maxWarningMsg: document.getElementById("max-warning-msg").value,
		redValue: parseFloat(document.getElementById("red-value").value),
		maxValue: parseFloat(document.getElementById("max-value").value),

		lowWarningValue: parseFloat(document.getElementById("low-warning-value").value),
		minWarningMsg: document.getElementById("min-warning-msg").value,
		blueValue: parseFloat(document.getElementById("blue-value").value),
		minValue: parseFloat(document.getElementById("min-value").value),
		imageDir: document.getElementById("image-dir").value,
		currentValue: (parseFloat(document.getElementById("high-warning-value").value)+parseFloat(document.getElementById("low-warning-value").value))/2,
    }

    socket.emit("add-sensor", res);
}