let url=document.URL.slice(0);

if((document.URL.lastIndexOf("/")-document.URL.indexOf("/"))>1){
    url=url.slice(0, document.URL.lastIndexOf("/"));
}

let socket=io.connect(url);

//Uno para el cambio de estado
socket.on('cambio-temp', (data)=>{
    let campo=document.getElementById("temperatura");

    campo.innerText=data.temp+" °C";

    if(data.temp>=data.tempWarning && data.temp<data.maxTemp)
        campo.style.color="yellow";

    else if(data.temp>=data.maxTemp)
        campo.style.color="red";

    else if(data.temp<data.tempWarning)
        campo.style.color="";
});

/*
function modificarAlertas(valor){
    let alertas=document.getElementById("mensaje-alerta");
    //alert(alertas.innerText);

    let parentesisBegin=alertas.innerText.indexOf("(");
    let parentesisEnd=alertas.innerText.indexOf(")");
    
    let cadena=[...alertas.innerText];
    
    let valor=parseInt(alertas.innerText[parentesisBegin+1])+1;
    
    //alert(valor)
    cadena.splice(parentesisBegin+1, parentesisEnd-parentesisBegin-1, valor)

    alertas.innerText=cadena.join("");
}
*/
socket.on('cambio-lumens', (data)=>{
    let campo=document.getElementById("lumens");

    campo.innerText=data.lumens+" lumens";

    if(data.lumens>=data.lumensWarning && data.lumens<data.maxLumens){
        campo.style.color="yellow";

  //      modificarAlertas(data.alertas);
    }

    else if(data.lumens>=data.maxLumens)
        campo.style.color="red";

    else if(data.lumens<data.lumensWarning)
        campo.style.color="";
});

socket.on("clientes", (users)=>{
    actualizarLista(users);
});

socket.on("estado-persiana", (estado)=>{
    if(estado!=estaArriba){
        togglePersiana();
    }
});

let estaArriba=true;
function togglePersiana(){
    let aux=document.getElementById("estado-persiana");
    if(estaArriba){
        estaArriba=false;
        aux.innerText="Bajado";
    }
    else{
        estaArriba=true;
        aux.innerText="Alzado";
    }    

    aux.classList.toggle("rojo");

    //socket.emit("estado-persiana", estaArriba);
}

//Otro para recibir y que se actualice la info
let aire=document.getElementById("aire");
let persiana=document.getElementById("persiana");

let esOff=true;
aire.addEventListener("click", ()=>{
    let aux=document.getElementById("estado-aire");

    if(esOff){
        esOff=false;
        aux.innerText="ON";
    }
    else{
        esOff=true;
        aux.innerText="OFF";
    }
    
    aux.classList.toggle("verde");
});

persiana.addEventListener("click", ()=>{
    togglePersiana();
    socket.emit("estado-persiana", estaArriba);
});

function actualizarLista(usuarios){
    let usuariosConectados=document.getElementById("usuarios-conectados-container");
    usuariosConectados.innerHTML="";

    let lista=document.createElement("ul");
    usuariosConectados.appendChild(lista);

    for(let i=0; i<usuarios.length; i++){
        let item=document.createElement("li");
        item.innerHTML=usuarios[i].address+":"+usuarios[i].port;
        lista.appendChild(item);
    }
}