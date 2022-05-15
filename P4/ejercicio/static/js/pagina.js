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

socket.on("clientes", (users)=>{
    actualizarLista(users);
});

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

let estaAbajo=true;
persiana.addEventListener("click", ()=>{
    let aux=document.getElementById("estado-persiana");
    if(estaAbajo){
        estaAbajo=false;
        aux.innerText="Alzado";
    }
    else{
        estaAbajo=true;
        aux.innerText="Bajado";
    }    

    aux.classList.toggle("verde");
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