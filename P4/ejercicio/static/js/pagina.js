let url=document.URL.slice(0);

if((document.URL.lastIndexOf("/")-document.URL.indexOf("/"))>1){
    url=url.slice(0, document.URL.lastIndexOf("/"));
}

let socket=io.connect(url);

//Uno para el cambio de estado
/*
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

socket.on('cambio-lumens', (data)=>{
    console.log(data)
    let campo=document.getElementById("lumens");

    campo.innerText=data.lumens+" lumens";

    if(data.lumens>=data.lumensWarning && data.lumens<data.maxLumens){
        campo.style.color="yellow";
    }

    else if(data.lumens>=data.maxLumens)
        campo.style.color="red";

    else if(data.lumens<data.lumensWarning)
        campo.style.color="";
});
*/

socket.on('cambio-sensor', (data)=>{
    console.log(data)
    //alert(data.currentValue);
    //alert(data.name);
    //alert(data.currentValue+" celsius");

    let campo=document.getElementById(data.name);

    campo.innerText=data.currentValue+" "+data.unit;

    if(data.currentValue>=data.warningValue && data.currentValue<data.maxValue){
        campo.style.color="yellow";
    }

    else if(data.currentValue>=data.maxValue)
        campo.style.color="red";

    else if(data.currentValue<data.warningValue)
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

socket.on("estado-AC", (estado)=>{
    if(estado!=esOff){
        toggleAire();
    }
});

let esOff=true;

function toggleAire(){
    let aux=document.getElementById("estado-aire");

    if(esOff){
        esOff=false;
        aux.innerText="ON";
    }
    else{
        esOff=true;
        aux.innerText="OFF";
    }
    
    aux.classList.toggle("rojo");
    aux.classList.toggle("verde");
}

aire.addEventListener("click", ()=>{
    toggleAire();
    socket.emit("estado-AC", esOff);
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

function actualizarHistorial(mediciones){
    let historial=document.getElementById("historial");
    historial.innerHTML="";

    let lista=document.createElement("ul");
    historial.appendChild(lista);

    //console.log(mediciones.length);
    for(let i=0; i<mediciones.length; i++){
        let item=document.createElement("li");
        item.innerHTML="<strong>Evento:</strong> "+mediciones[i].evento+"&emsp;<strong>Valor:</strong> "+mediciones[i].valor+"&emsp;<strong>Fecha:</strong> "+mediciones[i].fecha;
        lista.appendChild(item);
    }
}

socket.on("historial", (collection)=>{
    //console.log("entro")
    actualizarHistorial(collection);
});



function modificarAlertas(mensajes){
    let alertas=document.getElementById("mensaje-alerta");

    let parentesisBegin=alertas.innerText.indexOf("(");
    let parentesisEnd=alertas.innerText.indexOf(")");
    
    //Paso el string a array para poder usar sus metodos
    let cadena=[...alertas.innerText];
    
    //let valor=parseInt(alertas.innerText[parentesisBegin+1])+1;
    
    cadena.splice(parentesisBegin+1, parentesisEnd-parentesisBegin-1, mensajes.length)

    alertas.innerText=cadena.join("");

    let desplegable=document.getElementById("desplegable");
    desplegable.innerHTML="";

    for(let i=0; i<mensajes.length; i++){
        let aux=document.createElement("div");
        aux.innerHTML=mensajes[i].msg;

        desplegable.appendChild(aux);
    }
}


socket.on("alerta", (alertas)=>{
    console.log("hay una alerta");
    modificarAlertas(alertas);
});


let esOpen=false;
let alertasClick=document.getElementById("alertas");
alertasClick.addEventListener("click", ()=>{
    let desplegable=document.getElementById("desplegable");

    if(esOpen){
        esOpen=false;
        desplegable.style.display="grid";
    }
    else{
        esOpen=true;
        desplegable.style.display="";
    }
});