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

function toggleActuador(data){
    let estadoActuador=document.getElementById("estado-"+data.name);
    let imagen=document.getElementById("imagen-"+data.name);
    let divSensor=document.getElementById("div-"+data.name);

    //alert(data.name)
    if(data.deviceState){
        data.deviceState=false;
        estadoActuador.innerText="OFF";
        imagen.style.filter="grayscale(100%)";
    }
    else{
        data.deviceState=true;
        estadoActuador.innerText="ON";
        imagen.style.filter="";
    }

    estadoActuador.classList.toggle("verde");
    estadoActuador.classList.toggle("rojo");

    divSensor.classList.toggle("apagado");
}

function setActuador(data){
    let estadoActuador=document.getElementById("estado-"+data.idName);
    let imagen=document.getElementById("imagen-"+data.idName);
    let divSensor=document.getElementById("div-"+data.idName);

    if(!data.state){
        estadoActuador.innerText="OFF";
        imagen.style.filter="grayscale(100%)";

        estadoActuador.classList.remove("verde");
        estadoActuador.classList.add("rojo");        
        divSensor.classList.add("apagado");
    }
    else{
        estadoActuador.innerText="ON";
        imagen.style.filter="";
        divSensor.classList.remove("apagado");
        estadoActuador.classList.add("verde");
        estadoActuador.classList.remove("rojo");                
    }
}

socket.on("obtener-sensores", (data)=>{
    console.log("llamame")
    console.log(data);

    let cards=document.getElementById("div-aparatos");
    cards.innerHTML="";


    for(let i=data.length-1; i>=0; i--){
        cards.insertAdjacentHTML("afterbegin", 
        "<div id=\"div-"+data[i].name+"\" class=\"secciones-aparato\">"+
        "<div class=\"negrita grande fondo-sec\">"+
            data[i].sensorName+
        "</div>"+
        "<div class=\"fondo-sec\" id=\""+data[i].name+"\">"+data[i].currentValue+" "+data[i].unit+"</div>"+
        "<div class=\"pad-horizontal\">"+      //eliminar pad-horizontal, puede que no haga falta
            "<img id=\"imagen-"+data[i].name+"\" class=\"imagen\" src=\"static/images/ac-off.jpg\"/>"+        //CAMBIAR PARA LA ENTREGA
        "</div>"+
    "</div>")
    }
/*
    let aparatos=document.getElementsByClassName("secciones-aparato");

    for(let i=0; i<aparatos.length; i++){
        aparatos[i].addEventListener("click", ()=>{
            //alert(data[i].id);
            socket.emit("obtener-sensor-id", data[i].id);
        });
    }
*/
    console.log(data)
})
/*
socket.on("obtener-sensor-id", (data)=>{
    if(data.deviceState)
        data.deviceState=false;
    else
        data.deviceState=true;    

    //alert(data.id);

    socket.emit("cambio-sensor", data);
})
*/
socket.on('cambio-sensor', (data)=>{
    console.log("cambio-sensor")
    console.log(data)

    //alert(data.id);

    let campo=document.getElementById(data.name);

    campo.innerText=data.currentValue+" "+data.unit;

    if(data.currentValue>=data.warningValue && data.currentValue<data.maxValue){
        campo.style.color="yellow";
    }

    else if(data.currentValue>=data.maxValue)
        campo.style.color="red";

    else if(data.currentValue<data.warningValue)
        campo.style.color="";

    //setActuador(data);
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
    console.log("entrada")
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

    console.log("salida")
    console.log("length: "+mediciones.length);
}

socket.on("historial", (collection)=>{
    //console.log("entro")
    actualizarHistorial(collection);
});



function modificarAlertas(mensajes){
    console.log("entrada")
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
    console.log("salida")
}


socket.on("alerta", (alertas)=>{
    console.log("hay una alerta: "+alertas.length);
    modificarAlertas(alertas);
});


let esOpen=true;
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





//Seccion para las opciones extra
let opcionesOpen=true;
let opcionesClick=document.getElementById("mensaje-opciones");
opcionesClick.addEventListener("click", ()=>{
    let desplegable=document.getElementById("desplegable-opciones");

    if(opcionesOpen){
        opcionesOpen=false;
        desplegable.style.display="grid";
    }
    else{
        opcionesOpen=true;
        desplegable.style.display="";
    }
});



//----------------------------------------------------------------------------------

socket.on("obtener-actuadores", (data)=>{
    let contenedor=document.getElementById("actuadores-container");
    contenedor.innerHTML="";

    for(let i=data.length-1; i>=0; i--){
        contenedor.insertAdjacentHTML("afterbegin", 
            "<div class=\"div-actuadores\">"+
            "<div id=\"div-"+data[i].idName+"\" class=\"secciones-aparato apagado\">"+
                "<div class=\"negrita grande fondo-sec estado\">"+
                    "<div>"+
                        data[i].name+
                    "</div>"+
                    "<div class=\"rojo\" id=\"estado-"+data[i].idName+"\">"+
                        "OFF"+
                    "</div>"+
                "</div>"+
                "<div class=\"pad-horizontal\">"+
                    "<img id=\"imagen-"+data[i].idName+"\" class=\"imagen\" src=\"static/images/"+data[i].img+"\" style=\"filter: grayscale(100%)\"/>"+
                "</div>"+
            "</div>"+
        "</div>"            
        );
    }

    let actuadores=document.getElementsByClassName("div-actuadores");

    for(let i=0; i<actuadores.length; i++){
        actuadores[i].addEventListener("click", ()=>{
            //alert(data[i].id);
            socket.emit("obtener-actuador-id", data[i].id);
        });
    }    

})

socket.on("obtener-actuador-id", (data)=>{
    console.log("antes: "+data.state)
    data.state=(data.state)? false : true;
    console.log("despues: "+data.state)
    socket.emit("cambio-actuador", data);
});

socket.on("cambio-actuador", (data)=>{
    let estado=document.getElementById("estado-"+data.idName);
    estado.value=(data.state)? "ON" : "OFF";

    console.log("cambio en el actuador")
    setActuador(data);
});

//----------------------------------------------------------------------------------