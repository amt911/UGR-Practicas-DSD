let url=document.URL.slice(0);

if((document.URL.lastIndexOf("/")-document.URL.indexOf("/"))>1){
    url=url.slice(0, document.URL.lastIndexOf("/"));
}

let socket=io.connect(url);

socket.on("recibir-msgs", (data)=>{
	let caja=document.getElementById("seccion-chat");
	caja.innerHTML="";

	for(let i=data.length-1; i>=0; i--){
		caja.insertAdjacentHTML("afterbegin", 
		"<div class=\"mensaje\">"+
		"<div class=\"usuario\">"+
			"usuario (hora)"+
		"</div>"+
		"<div class=\"texto\">"+
			data[i]+
		"</div>"+
	 	"</div>"
		);
	}
	
})


function enviar(){
	let msg=document.getElementById("texto").value;
	 socket.emit("enviar-msg", msg);
}