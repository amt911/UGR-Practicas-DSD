// Esta parte obtiene la URL base para realizar peticiones
let url=document.URL.slice(0);

if((document.URL.lastIndexOf("/")-document.URL.indexOf("/"))>1){
    url=url.slice(0, document.URL.lastIndexOf("/"));
}
//---------------------------------------------------------


let socket=io.connect(url);

/**
 * Obtiene todos los mensajes de la base de datos del chat y los pone en la pantalla.
 */
socket.on("recibir-todos-msgs", (data)=>{
	let caja=document.getElementById("seccion-chat");
	caja.innerHTML="";

	for(let i=data.length-1; i>=0; i--){
		//Si son mios son de un estilo, si no de otros
		if(data[i].user.split("(")[0].slice(0, -1)==sessionStorage.getItem("user")){
			console.log("es la hora de las tortas");
			caja.insertAdjacentHTML("afterbegin",
			"<div class=\"relativo\">"+ 
			"<div class=\"mensaje mis-msg\">"+
			"<div class=\"usuario\">"+
				data[i].user+" ("+data[i].fecha+")"+
			"</div>"+
			"<div class=\"texto\">"+
				data[i].msg+
			"</div>"+
			"</div>"+
			"</div>"
			);
		}
		else{
			console.log("NO es la hora de las tortas");
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
	}
	
});

/**
 * Se activa cuando un usuario envia un mensaje, actualiza los mensajes
 */
socket.on("recibir-msg", (data)=>{
	let caja=document.getElementById("seccion-chat");

	if(data.user.split("(")[0].slice(0, -1)==sessionStorage.getItem("user")){
		caja.insertAdjacentHTML("beforeend", 
		"<div class=\"relativo\">"+ 
		"<div class=\"mensaje mis-msg\">"+
		"<div class=\"usuario\">"+
			data.user+" ("+data.fecha+")"+
		"</div>"+
		"<div class=\"texto\">"+
			data.msg+
		"</div>"+
		"</div>"+
		"</div>"
		);	
	}
	else{
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
	}
});

/**
 * Permite comprobar si se han introducido palabrotas y las elimina. He puesto palabras no muy malsonantes por
 * motivos obvios.
 */
function comprobarPalabrotas(){
    var texto=document.getElementById("texto");
    var palabrotas=["inutil", "imbecil", "terrible", "caca", "patada", "necio", "tonto", "fiesta", "malo", "corcholis"]

    palabrotas.forEach(
        (aux)=>{       
            texto.value=texto.value.replace(new RegExp(aux, "ig"), "*".repeat(aux.length))
        }
    )
}

/**
 * Permite obtener la fecha actual en un formato mas legible
 * @returns Un string con la fecha actual y la hora formateadas
 */
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

//let user;		

/**
 * Funcion que se activa cuando un usuario envia un mensaje
 */
function enviar(){
	comprobarPalabrotas();
	let msg=document.getElementById("texto").value;
	
	 socket.emit("recibir-msg", {user: sessionStorage.getItem("user"), msg: msg, fecha: obtenerFechaActual()});

	 document.getElementById("texto").value="";

	 let div = document.getElementById("wrapper");
	 div.scrollTop = div.scrollHeight;	 

	 console.log(div.clientHeight);
}

/**
 * Funcion que sirve para registrarse o iniciar sesion, en caso de dar error se muestra por pantalla
 */
function registro(){
	let name=document.getElementById("name").value;
	let passwd=document.getElementById("passwd").value;
	let select=document.getElementById("opcion-login");

	let esInicio=(select.value==="inicio")? true: false;

	if(esInicio)
		socket.emit("comprobar-cuenta", {name: name, passwd: passwd});
	else
		socket.emit("crear-cuenta", {name: name, passwd: passwd});
}

/**
 * Comprueba que la cuenta exista y la contraseña sea correcta. En otro caso se muestra un mensaje de error.
 */
socket.on("comprobar-cuenta", (data)=>{
	if(data!=0){
		let name=document.getElementById("name").value;
		let passwd=document.getElementById("passwd");

		let divLogin=document.getElementById("wrapper-login");
		let divChat=document.getElementById("chat");		
		divLogin.style.display="none";
		divChat.style.display="grid";
		//user=name;
		sessionStorage.setItem("user", name);
		sessionStorage.setItem("passwd", passwd.value);

		socket.emit("recibir-todos-msg", {name: name, passwd: passwd.value});
		passwd.value="";
	}
	else{
		let error=document.getElementById("errores");
		error.innerText="Error, los credenciales son invalidos"
	}
});

/**
 * Comprueba que al crear una cuenta se haya hecho correctamente. En caso negativo, se muestra un mensaje de error.
 */
socket.on("crear-cuenta", (data)=>{
	if(data){
		let name=document.getElementById("name").value;
		let passwd=document.getElementById("passwd");

		//Ponemos los credenciales en un sessionStorage mietras que este la pestaña abierta
		sessionStorage.setItem("user", name);
		sessionStorage.setItem("passwd", passwd.value);

		let divLogin=document.getElementById("wrapper-login");
		let divChat=document.getElementById("chat");		
		divLogin.style.display="none";
		divChat.style.display="grid";	

		socket.emit("recibir-todos-msg", {name: name, passwd: passwd.value});
		passwd.value="";
	}
	else{
		let error=document.getElementById("errores");
		error.innerText="Error, los credenciales ya existen"		
	}
})



//PARTE MAIN
let cajaChat=document.getElementById("texto");
cajaChat.addEventListener("keypress", comprobarPalabrotas);

if(sessionStorage.getItem("user")!=null){
	//alert("supuestamente entro")
	let divLogin=document.getElementById("wrapper-login");
	let divChat=document.getElementById("chat");		
	divLogin.style.display="none";
	divChat.style.display="grid";		

	socket.emit("recibir-todos-msg", {name: sessionStorage.getItem("user"), passwd: sessionStorage.getItem("passwd")});
}

console.log(sessionStorage.getItem("user"))
console.log(sessionStorage.getItem("passwd"))