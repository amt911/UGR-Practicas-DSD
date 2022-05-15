let url=document.URL.slice(0);

if((document.URL.lastIndexOf("/")-document.URL.indexOf("/"))>1){
    url=url.slice(0, document.URL.lastIndexOf("/"));
}

let socket=io.connect(url);

//Uno para el cambio de estado
socket.on('cambio-temp', (data)=>{
    let campo=document.getElementById("temperatura");

    campo.innerText=data+" °C";
});

socket.on('cambio-lumens', (data)=>{
    let campo=document.getElementById("lumens");

    campo.innerText=data+" lumens";
});

//Otro para recibir y que se actualice la info