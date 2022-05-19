let url=document.URL.slice(0);

if((document.URL.lastIndexOf("/")-document.URL.indexOf("/"))>1){
    url=url.slice(0, document.URL.lastIndexOf("/"));
}

let socket=io.connect(url);


let pizarra=document.getElementById("pizarra");
let pizarra2D=pizarra.getContext("2d");

pizarra2D.strokeStyle="blue";
pizarra.style.backgroundColor="#FFFFFF";
pizarra.style.border="solid 1px black";

let pulsado=false;

pizarra.addEventListener("mousemove", (e)=>{
    if(pulsado){
        let viewport=pizarra.getBoundingClientRect();
        pizarra2D.lineTo(e.clientX-viewport.left, e.clientY-viewport.top);
        pizarra2D.stroke();
    }
});

pizarra.addEventListener("mousedown", (e)=>{
    pulsado=true;
    let viewport=pizarra.getBoundingClientRect();
    pizarra2D.beginPath();  //Limpiamos la pila de ordenes
    pizarra2D.lineTo(e.clientX-viewport.left, e.clientY-viewport.top);
});

pizarra.addEventListener("mouseup", (e)=>{
    pulsado=false;
    console.log("TENGO QUE ENVIARLO");
    socket.emit("update-pizarra", pizarra.toDataURL());
});

socket.on("update-pizarra", (data)=>{
    console.log("A PINTAR")
    //let aux=new Image();
    //aux.src=data;
    let a=document.getElementById("aux");
    a.src=data;
    pizarra2D.drawImage(a, 0, 0);
})
