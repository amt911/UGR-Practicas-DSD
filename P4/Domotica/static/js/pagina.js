// Esta parte obtiene la URL base para realizar peticiones
let url=arreglarURL(document.URL);
//-------------------------------------------------------------

let socket=io.connect(url);


/**
 * Actualiza la lista de los clientes conectados
 */
socket.on("clientes", (users)=>{
    actualizarLista(users);
});

/**
 * Inicializa todos los sensores existentes y genera html para mostrarlos
 */
socket.on("obtener-sensores", (data)=>{

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
})

/**
 * Cambia el estilo del recuadro del sensor de acuerdo a su valor.
 * @param data Sensor al que se le va a cambiar el estilo
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

/**
 * Cuando hay un cambio en el sensor, se cambia su estilo de nuevo
 */
socket.on('cambio-sensor', (data)=>{
    setSensorValores(data);
});

/**
 * Actualiza la lista HTML con los usuarios que hay actualmente conectados.
 * @param usuarios Usuarios actualmente conectados
 */
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


/**
 * Actualiza las mediciones realizadas en la base de datos.
 * @param mediciones Todas las mediciones actualizadas
 */
function actualizarHistorial(mediciones){
    let historial=document.getElementById("lista-historial");

    for(let i=0; i<mediciones.length; i++){
        historial.insertAdjacentHTML("beforeend",
        "<li><strong>Sensor: </strong> "+mediciones[i].evento+"&emsp;<strong>Valor:</strong> "+mediciones[i].valor+"&emsp;<strong>Fecha:</strong> "+mediciones[i].fecha+"</li>"
        );
    }
}

/**
 * Evento que hace que se actualice el historial de cambios en los sensores al conectarse el cliente
 */
socket.on("historial", (collection)=>{
    actualizarHistorial(collection);
});


/**
 * Evento que hace que se inserte el nuevo cambio en algun sensor. Esto hace que no 
 * haga falta tener que enviar todo el registro nada mas que la primera vez que se conecta
 */
socket.on("nuevo-registro", (data)=>{
    let historial=document.getElementById("lista-historial");

    historial.insertAdjacentHTML("beforeend",
    "<li><strong>Evento: </strong> "+data.evento+"&emsp;<strong>Valor:</strong> "+data.valor+"&emsp;<strong>Fecha:</strong> "+data.fecha+"</li>"
    );
})

/**
 * Modifica la pagina para mostrar las nuevas alertas.
 * @param mensajes Mensajes de las alertas a mostrar
 */
function modificarAlertas(mensajes){
    let alertas=document.getElementById("mensaje-alerta");

    let parentesisBegin=alertas.innerText.indexOf("(");
    let parentesisEnd=alertas.innerText.indexOf(")");
    
    //Paso el string a array para poder usar sus metodos
    let cadena=[...alertas.innerText];
    
    cadena.splice(parentesisBegin+1, parentesisEnd-parentesisBegin-1, mensajes.length)

    alertas.innerText=cadena.join("");

    let desplegable=document.getElementById("desplegable");
    desplegable.innerHTML="";

    for(let i=0; i<mensajes.length; i++){
        let aux=document.createElement("div");
        aux.innerHTML=mensajes[i].msg;

        desplegable.appendChild(aux);
    }

    if(mensajes.length>0)
        alertas.style.color="yellow";
    else
        alertas.style.color="";
}

/**
 * Modifica las alertas cuando se añade o elimina alguna
 */
socket.on("alerta", (alertas)=>{
    modificarAlertas(alertas);
});



//----------------------------------------------------------------------------------

/**
 * Obtiene todos los actuadores solo al recargar la pagina
 */
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
        setActuador(data[i]);
    }

    let actuadores=document.getElementsByClassName("secciones-actuador");

    for(let i=0; i<actuadores.length; i++){
        actuadores[i].addEventListener("click", ()=>{
            data[i].state=(data[i].state)? false : true;
            socket.emit("cambio-actuador", data[i]);            
        });
    }    

})

/**
 * Cambia el estilo del actuador pasado por parametro
 * @param data Actuador sobre el que se va a cambiar el estilo
 */
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

socket.on("cambio-actuador", (data)=>{
    setActuador(data);
});

socket.on("get-boton-sim", (data)=>{
    esParar=data;

    if(!esParar){
        botonSimulacion.innerText="Iniciar simulacion sensores";
    }
    else{
        botonSimulacion.innerText="Parar simulacion sensores";
    }
});

//----------------------------------------------------------------------------------
//ZONA MAIN
let botonSimulacion=document.getElementById("simulacion");

let esParar=false;
botonSimulacion.addEventListener("click", ()=>{
    if(esParar){
        esParar=false;
        //botonSimulacion.innerText="Iniciar simulacion sensores";
        socket.emit("parar-sim");
    }
    else{
        esParar=true;
        //botonSimulacion.innerText="Parar simulacion sensores";
        socket.emit("comenzar-sim");
    }
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