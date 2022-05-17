let url=document.URL.slice(0);

if((document.URL.lastIndexOf("/")-document.URL.indexOf("/"))>1){
    url=url.slice(0, document.URL.lastIndexOf("/"));
}

let socket=io.connect(url);

function enviar(){
    let res={
		id: null,   //Se le pone en el servidor
		name: document.getElementById("sensor-name").value,
		unit: document.getElementById("unit").value,
		warningValue: document.getElementById("warning-value").value,
		warningMsg: document.getElementById("warning-msg").value,
		maxValue: document.getElementById("max-value").value,
		imageDir: document.getElementById("image-dir").value,
		currentValue: 0,
		deviceState: false,
		deviceName: document.getElementById("device-name").value
    }

    socket.emit("add-sensor", res);
}