let url=document.URL.slice(0);

if((document.URL.lastIndexOf("/")-document.URL.indexOf("/"))>1){
    url=url.slice(0, document.URL.lastIndexOf("/"));
}

let socket=io.connect(url);

socket.on("recibir-todos-msgs", (data)=>{
	let caja=document.getElementById("seccion-chat");
	caja.innerHTML="";

	for(let i=data.length-1; i>=0; i--){
		caja.insertAdjacentHTML("afterbegin", 
		"<div class=\"mensaje\">"+
		"<div class=\"usuario\">"+
			data[i].user+" ("+data[i].fecha+")"+
		"</div>"+
		"<div class=\"texto\">"+
			data[i].msg+
		"</div>"+
	 	"</div>"
		);
	}
	
})

socket.on("recibir-msg", (data)=>{
	let caja=document.getElementById("seccion-chat");

	caja.insertAdjacentHTML("beforeend", 
	"<div class=\"mensaje\">"+
	"<div class=\"usuario\">"+
		data.user+" ("+data.fecha+")"+
	"</div>"+
	"<div class=\"texto\">"+
		data.msg+
	"</div>"+
	 "</div>"
	);	
});


function comprobarPalabrotas(){
    var texto=document.getElementById("texto");
    var palabrotas=["palabrota", "imbecil", "terrible", "caca", "patada", "necio", "tonto", "fiesta", "malo", "corcholis"]

    palabrotas.forEach(
        (aux)=>{       
            texto.value=texto.value.replace(new RegExp(aux, "ig"), "*".repeat(aux.length))
        }
    )
}

let cajaChat=document.getElementById("texto");

cajaChat.addEventListener("keypress", comprobarPalabrotas);


function obtenerFechaActual(){
    let fecha=new Date()
	let meses={
		0: "enero",
		1: "febrero",
		2: "marzo",
		3: "abril",
		4: "mayo",
		5: "junio",
		6: "julio",
		7: "agosto",
		8: "septiembre",
		9: "octubre",
		10: "noviembre",
		11: "diciembre"
	};

    let dia=(fecha.getDate()<10)?"0"+fecha.getDate(): fecha.getDate();
    let minutos=(fecha.getMinutes()<10)?"0"+fecha.getMinutes(): fecha.getMinutes();
    let horas=(fecha.getHours()<10)?"0"+fecha.getHours():fecha.getHours();

    return dia+" de "+meses[fecha.getMonth()]+" del "+fecha.getFullYear()+", "+horas+":"+minutos
}

let user;

function enviar(){
	comprobarPalabrotas();
	let msg=document.getElementById("texto").value;
	
	 socket.emit("recibir-msg", {user, msg: msg, fecha: obtenerFechaActual()});

	 document.getElementById("texto").value="";

	 let div = document.getElementById("wrapper");
	 div.scrollTop = div.scrollHeight;	 

	 console.log(div.clientHeight);
}


function registro(){
	/*
	let divLogin=document.getElementById("wrapper-login");
	let divChat=document.getElementById("chat");
*/

	let name=document.getElementById("name").value;
	let passwd=document.getElementById("passwd").value;
	let select=document.getElementById("opcion-login");

	let esInicio=(select.value==="inicio")? true: false;
	console.log("esInicio"+esInicio);

	//alert(name);
	//alert(passwd);

	if(esInicio)
		socket.emit("comprobar-cuenta", {name: name, passwd: passwd});
	else
		socket.emit("crear-cuenta", {name: name, passwd: passwd});

/*
	divLogin.style.display="none";
	divChat.style.display="grid";
*/
}

socket.on("comprobar-cuenta", (data)=>{
	if(data!=0){
		let name=document.getElementById("name").innerText;
		let passwd=document.getElementById("passwd");
		passwd="";

		let divLogin=document.getElementById("wrapper-login");
		let divChat=document.getElementById("chat");		
		divLogin.style.display="none";
		divChat.style.display="grid";
		user=name;
	}
	else{
		let error=document.getElementById("errores");
		error.innerText="Error, los credenciales son invalidos"
	}
});

socket.on("crear-cuenta", (data)=>{
	if(data){
		let name=document.getElementById("name").innerText;
		let passwd=document.getElementById("passwd");
		passwd="";
		user=name;

		let divLogin=document.getElementById("wrapper-login");
		let divChat=document.getElementById("chat");		
		divLogin.style.display="none";
		divChat.style.display="grid";		
	}
	else{
		let error=document.getElementById("errores");
		error.innerText="Error, los credenciales ya existen"		
	}
})