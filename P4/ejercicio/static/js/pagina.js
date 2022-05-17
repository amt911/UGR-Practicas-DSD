let url=document.URL.slice(0);

if((document.URL.lastIndexOf("/")-document.URL.indexOf("/"))>1){
    url=url.slice(0, document.URL.lastIndexOf("/"));
}

let socket=io.connect(url);

socket.on("clientes", (users)=>{
    actualizarLista(users);
});

//----------------------------------------------------------------------------------
//Otro para recibir y que se actualice la info

//socket.emit("obtener-sensores", true);

socket.on("obtener-sensores", (data)=>{
    console.log("llamame")
    let cards=document.getElementById("div-aparatos");
    cards.innerHTML="";

    for(let i=0; i<data.length; i++){
        cards.insertAdjacentHTML("afterbegin", 
        "<div class=\"secciones-aparato\">"+
        "<div class=\"negrita grande fondo-sec estado\">"+
            "<div>"+
                data[i].deviceName+
            "</div>"+
            "<div class=\"rojo\" id=\"estado-aire\">"+
                data[i].deviceState+
            "</div>"+
        "</div>"+
        "<div class=\"fondo-sec\" id=\""+data[i].name+"\">"+data[i].currentValue+" "+data[i].unit+"</div>"+
        "<div>"+
            "<img id=\"aire\" class=\"imagen\" src=\"static/images/ac-off.jpg\"/>"+        //CAMBIAR PARA LA ENTREGA
        "</div>"+
    "</div>")
    }

    let aparatos=document.getElementsByClassName("secciones-aparato");

    for(let i=0; i<aparatos.length; i++){
        aparatos[i].addEventListener("click", ()=>alert(i));
    }
})

socket.on('cambio-sensor', (data)=>{
    console.log(data)

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


/*
let aire=document.getElementById("aire");
let persiana=document.getElementById("persiana");

socket.on("estado-persiana", (estado)=>{
    if(estado!=estaArriba){
        togglePersiana();
    }
});


socket.on("estado-AC", (estado)=>{
    if(estado!=esOff){
        toggleAire();
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
*/
//----------------------------------------------------------------------------------


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
    console.log(mensajes);
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
        aux.innerHTML=mensajes[i].warningMsg;

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