let url=document.URL.slice(0);

if((document.URL.lastIndexOf("/")-document.URL.indexOf("/"))>1){
    url=url.slice(0, document.URL.lastIndexOf("/"));
}

let socket=io.connect(url);

function enviar(){
    let valor=document.getElementById("cuadro").value;
    socket.emit('temperatura', valor);
}