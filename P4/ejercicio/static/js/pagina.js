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
/*
function toggleActuador(data){
    let estadoActuador=document.getElementById("estado-"+data.name);
    let imagen=document.getElementById("imagen-"+data.name);
    let divActuador=document.getElementById("div-"+data.name);

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

    divActuador.classList.toggle("apagado");
}

/*
function setActuador(data){
    let estadoActuador=document.getElementById("estado-"+data.idName);
    let imagen=document.getElementById("imagen-"+data.idName);
    let divActuador=document.getElementById("div-"+data.idName);
    let banner=document.getElementById("banner-"+data.idName);

    if(!data.state){
        estadoActuador.innerText="OFF";
        imagen.style.filter="grayscale(100%)";

        estadoActuador.classList.remove("verde");
        estadoActuador.classList.add("rojo");        
        divActuador.classList.add("apagado");
        banner.classList.remove("fondo-sec");
    }
    else{
        estadoActuador.innerText="ON";
        imagen.style.filter="";
        divActuador.classList.remove("apagado");
        estadoActuador.classList.add("verde");
        estadoActuador.classList.remove("rojo");                
        banner.classList.add("fondo-sec");
    }
}
*/
socket.on("obtener-sensores", (data)=>{
    //console.log("llamame")
    //console.log(data);

    let cards=document.getElementById("div-aparatos");
    cards.innerHTML="";


    for(let i=data.length-1; i>=0; i--){
        cards.insertAdjacentHTML("afterbegin", 
        "<div id=\"div-"+data[i].name+"\" class=\"secciones-sensor\">"+
        "<div class=\"negrita grande fondo-sec\">"+
            data[i].sensorName+
        "</div>"+
        "<div class=\"fondo-sec unidades-grandes\" id=\""+data[i].name+"\">"+data[i].currentValue+" "+data[i].unit+"</div>"+
        "<div id=\"div-imagen-"+data[i].name+"\" class=\"pad-horizontal\">"+
            "<img id=\"imagen-"+data[i].name+"\" class=\"imagen\" src=\"static/images/"+data[i].imageDir+"\"/>"+        //CAMBIAR PARA LA ENTREGA
        "</div>"+
    "</div>");

    setSensorValores(data[i]);
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

function setSensorValores(data){
    //rojo #b7352c
    let campo=document.getElementById(data.name);
    let fondo=document.getElementById("div-imagen-"+data.name);

    campo.innerText=data.currentValue+" "+data.unit;

    if((data.currentValue>=data.highWarningValue && data.currentValue<data.redValue) ||
    data.currentValue<=data.lowWarningValue && data.currentValue>data.blueValue){
        campo.style.color="yellow";
        fondo.style.backgroundColor="#c1c100";
    }

    else if(data.currentValue>=data.redValue && data.currentValue<=data.maxValue){
        campo.style.color="red";
        fondo.style.backgroundColor="#b7352c";
    }

    else if(data.currentValue<data.highWarningValue && data.currentValue>data.lowWarningValue){
        campo.style.color="";
        fondo.style.backgroundColor="";
    }
    
    else if(data.currentValue<=data.blueValue && data.currentValue>=data.minValue){
    campo.style.color="blue";
    fondo.style.backgroundColor="#2196F3";
    }
}

socket.on('cambio-sensor', (data)=>{
    console.log("cambio-sensor")
    console.log(data)

    setSensorValores(data);
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
        aux.innerHTML=mensajes[i].msg;

        desplegable.appendChild(aux);
    }
    //console.log("salida")

    if(mensajes.length>0)
        alertas.style.color="yellow";
    else
        alertas.style.color="";
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
                "<div id=\"div-"+data[i].idName+"\" class=\"secciones-actuador apagado\">"+
                    "<div id=\"banner-"+data[i].idName+"\" class=\"negrita grande fondo-sec estado\">"+
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
                "</div>"
            //"</div>"            
        );
        setActuador2(data[i]);
    }

    let actuadores=document.getElementsByClassName("secciones-actuador");

    for(let i=0; i<actuadores.length; i++){
        actuadores[i].addEventListener("click", ()=>{
            //alert(data[i].id);
            socket.emit("obtener-actuador-id", data[i].id);
        });
    }    

})

socket.on("obtener-actuador-id", (data)=>{
    //console.log("antes: "+data.state)
    data.state=(data.state)? false : true;
    //console.log("despues: "+data.state)
    socket.emit("cambio-actuador", data);
});

function setActuador2(data){
    //let estado=document.getElementById("estado-"+data.idName);
    //estado.innerText=(data.state)? "ON" : "OFF";

    //setActuador(data);    

    let estadoActuador=document.getElementById("estado-"+data.idName);
    let imagen=document.getElementById("imagen-"+data.idName);
    let divActuador=document.getElementById("div-"+data.idName);
    let banner=document.getElementById("banner-"+data.idName);

    if(!data.state){
        estadoActuador.innerText="OFF";
        imagen.style.filter="grayscale(100%)";

        estadoActuador.classList.remove("verde");
        estadoActuador.classList.add("rojo");        
        divActuador.classList.add("apagado");
        banner.classList.remove("fondo-sec");
    }
    else{
        estadoActuador.innerText="ON";
        imagen.style.filter="";
        divActuador.classList.remove("apagado");
        estadoActuador.classList.add("verde");
        estadoActuador.classList.remove("rojo");                
        banner.classList.add("fondo-sec");
    }    
}

socket.on("cambio-actuador", (data)=>{
    /*
    let estado=document.getElementById("estado-"+data.idName);
    //console.log(data);
    //console.log(estado);
    //console.log("------------antes actuador: "+estado.innerText)
    estado.innerText=(data.state)? "ON" : "OFF";

    //console.log("------------despues actuador: "+estado.innerText)
    //console.log("cambio en el actuador")
    setActuador(data);

    */

    setActuador2(data);
});

//----------------------------------------------------------------------------------

let botonSimulacion=document.getElementById("simulacion");

let esParar=false;
botonSimulacion.addEventListener("click", ()=>{
    if(esParar){
        esParar=false;
        botonSimulacion.innerText="Iniciar simulacion parametros";
        socket.emit("parar-sim");
    }
    else{
        esParar=true;
        botonSimulacion.innerText="Parar simulacion parametros";
        socket.emit("comenzar-sim");
    }
});

socket.on("get-boton-sim", (data)=>{
    console.log("e entrado esta mal escritop")
    esParar=data;

    if(!esParar){
        botonSimulacion.innerText="Iniciar simulacion parametros";
        //socket.emit("parar-sim");
    }
    else{
        botonSimulacion.innerText="Parar simulacion parametros";
        //socket.emit("comenzar-sim");
    }
});