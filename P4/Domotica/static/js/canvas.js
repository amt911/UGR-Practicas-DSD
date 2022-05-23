//Extrae la URL base para las peticiones
let url=arreglarURL(document.URL);
//-------------------------------------------

let socket=io.connect(url);

/**
 * Evento que traza las lineas nuevas de todos los clientes, includas las suyas propias
 */
socket.on("update-pizarra", (data)=>{
    pizarra2D.lineWidth=data.grosor;
    pizarra2D.strokeStyle=data.color;

    pizarra2D.beginPath();
    pizarra2D.lineTo(data.previo.x, data.previo.y);
    pizarra2D.lineTo(data.actual.x, data.actual.y);
    pizarra2D.stroke();

    pizarra2D.lineWidth=grosorAntiguo;
    pizarra2D.strokeStyle=colorAntiguo;
})

/**
 * Evento que limpia el lienzo
 */
socket.on("limpiar-lienzo", ()=>{
    pizarra2D.clearRect(0, 0, pizarra.width, pizarra.height);
});


//ZONA MAIN
let pizarra=document.getElementById("pizarra");
let pizarra2D=pizarra.getContext("2d");

pizarra2D.strokeStyle="blue";
pizarra2D.lineCap = "round";
pizarra.style.backgroundColor="#FFFFFF";
pizarra.style.border="solid 1px black";

let pulsado=false;
let previo={x:null, y:null};        //Una linea esta formada de dos puntos, este es el primero

pizarra.addEventListener("mousemove", (e)=>{
    if(pulsado){
        let viewport=pizarra.getBoundingClientRect();

        socket.emit("update-pizarra", {actual: {x: e.clientX-viewport.left, y: e.clientY-viewport.top}, 
        previo: previo,
        grosor: pizarra2D.lineWidth,
        color: pizarra2D.strokeStyle});

        previo.x=e.clientX-viewport.left;
        previo.y=e.clientY-viewport.top;
    }
});

pizarra.addEventListener("mousedown", (e)=>{
    pulsado=true;
    let viewport=pizarra.getBoundingClientRect();

    previo.x=e.clientX-viewport.left;
    previo.y=e.clientY-viewport.top;
});

pizarra.addEventListener("mouseup", (e)=>{
    pulsado=false;
});

let colorAntiguo="blue";
let colores=["blue", "black", "red", "white"];

let coloresDiv=document.getElementById("colores").children;

for(let i=0; i<coloresDiv.length; i++){
    coloresDiv[i].addEventListener("click", ()=>{
        pizarra2D.strokeStyle=colores[i]
        colorAntiguo=colores[i];
    })
}

let grosorAntiguo=1;
let grosor=[1, 3, 10];
let grosorDiv=document.getElementById("grosor").children;

for(let i=0; i<grosorDiv.length; i++){
    grosorDiv[i].addEventListener("click", ()=>{
        pizarra2D.lineWidth=grosor[i];
        grosorAntiguo=grosor[i];
    })
}

let borrarTodo=document.getElementById("borrar");

borrarTodo.addEventListener("click", ()=>{
    socket.emit("limpiar-lienzo");
});