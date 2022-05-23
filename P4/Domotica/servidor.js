let http=require("http");
var url = require("url");
let fs = require("fs");
let path = require("path");
let socketio = require("socket.io");
var MongoClient = require('mongodb').MongoClient;
const { isObject } = require("util");
const { Console } = require("console");
let mimeTypes = { "html": "text/html", "jpeg": "image/jpeg", "jpg": "image/jpeg", "png": "image/png", "js": "text/javascript", "css": "text/css", "swf": "application/x-shockwave-flash"};

let httpServer = http.createServer(
	function(request, response) {
		var uri = url.parse(request.url).pathname;
		if (uri=="/") uri = "/pagina.html";
		var fname = path.join(process.cwd(), uri);
		fs.exists(fname, function(exists) {
			if (exists) {
				fs.readFile(fname, function(err, data){
					if (!err) {
						var extension = path.extname(fname).split(".")[1];
						var mimeType = mimeTypes[extension];
						response.writeHead(200, mimeType);
						response.write(data);
						response.end();
					}
					else {
						response.writeHead(200, {"Content-Type": "text/plain"});
						response.write('Error de lectura en el fichero: '+uri);
						response.end();
					}
				});
			}
			else{
				console.log("Peticion invalida: "+uri);
				response.writeHead(200, {"Content-Type": "text/plain"});
				response.write('404 Not Found\n');
				response.end();
			}
		});
	}
)



httpServer.listen(8080);
console.log("Servicio HTTP iniciado");
let io=socketio(httpServer);

//Variables

let clientes=[];		//Los clientes que hay conectados en cada momento
let alertas=[];			//Alertas que se reciben del servidor

/**
 * 	Sensores que vienen por defecto
 * 	blueValue: representa valor en el cual se pone azul el numero
 * 	redValue: representa lo mismo que el anterior, pero para rojo
 * 	highWarningValue/lowWarningValue: representa los valores superiores e inferiores en los que la medicion se torna amarilla (advertencia)
 */
let sensores=[
	{
		id: 1,
		sensorName: "Termómetro",
		name: "temperatura",		//el id html
		unit: "°C",		//la unidad
		highWarningValue: 30,
		maxWarningMsg: "Temperatura peligrosamente alta, considere tomar medidas",
		redValue: 40,
		maxValue: 50,

		lowWarningValue: 15,
		minWarningMsg: "Temperatura demasiado baja, considere activar el radiador",
		blueValue: 10,
		minValue: -60,		
		imageDir: "termometro.png",
		currentValue: 20,
	},
	{
		id: 2,
		sensorName: "Sensor de luminosidad",
		name: "lumens",
		unit: "%",
		highWarningValue: 85,
		maxWarningMsg: "Luminosidad peligrosamente alta, considere tomar medidas",
		redValue: 90,
		maxValue: 100,

		lowWarningValue: 20,
		minWarningMsg: "Luminosidad demasiado baja, considere abrir la ventana o encender la luz",
		blueValue: 10,
		minValue: 0,		
		imageDir: "sun.png",
		currentValue: 52.5,
	},
	{
		id: 3,
		sensorName: "Sensor de humedad",
		name: "humedad",
		unit: "% HR",
		highWarningValue: 80,
		maxWarningMsg: "Humedad demasiado alta, considere encender el deshumidificador",
		redValue: 90,
		maxValue: 100,
 
		lowWarningValue: 30,
		minWarningMsg: "Humedad demasiado baja, considere activar el humidificador",
		blueValue: 20,
		minValue: 0,
		imageDir: "humedad.png",
		currentValue: 55,
	}
]

/**
 * Lista con los actuadores actualmente añadidos
 */
let actuadores=[
	{
		id: 1,
		name: "Aire acondicionado",
		state: false,
		idName: "AC",
		img: "aire.png"
	},

	{
		id: 2,
		name: "Persiana",
		state: false,
		idName: "ventana",
		img: "persiana.png"
	},
	{
		id: 3,
		name: "Deshumidificador",
		state: false,
		idName: "deshumidificador",
		img: "deshumidificador.png"
	},
	{
		id: 4,
		name: "Radiador",
		state: false,
		idName: "radiador",
		img: "radiador.png"
	},
	{
		id: 5,
		name: "Humidificador",
		state: false,
		idName: "humidificador",
		img: "humidificador.png"
	}		
];


let interval, estadoSim=false;		//Usado para los intervalos
let canvas=[];		//Los trazos almacenados de la pizarra digital

MongoClient.connect("mongodb://localhost:27017/", {useUnifiedTopology: true}, function(err, db){
	//Si el fallo es de que no se puede conectar, directamente se aborta el programa
	if(err)
		throw err;
	
	//Base de datos a utilizar
	let dbo = db.db("DSD_Practica_4");

	//Bases de datos necesarias para la practica. Cabe notar que con este metodo no es
	//necesario eliminar la coleccion ya que si no existe se crea, y en otro caso se accede
	let collection=dbo.collection("accionesSensores");	//Cambios en los valores de los sensores
	let msgDB=dbo.collection("mensajesDB");		//Mensajes del chat de texto
	let usuarios=dbo.collection("usuarios");	//Usuarios registrados en el sistema

	//Conexion de un cliente con el socket
	io.sockets.on('connection', (client) => {

		/**
		 * Función que al ser llamada detecta posibles estados incorrectos entre actuadores
		 * (por ejemplo, raidador y aire acondicionado encendidos) y manda las alertas correspondientes
		 */
		function comprobarActuador(){
			let hayAlertaCambio=false;	//Sirve para evitar emitir muchos eventos, solo se manda uno al final

			//Si se tiene la ventana en ON y el aire en ON, se envia alerta
			if(actuadores[0].state && actuadores[1].state && alertas.find(i=>i.name=="tip1")==undefined){
				alertas.push({name: "tip1", msg:"Es recomendable o cerrar la ventana o apagar el aire acondicionado"});		
				hayAlertaCambio=true;
			}
			else if(!(actuadores[0].state && actuadores[1].state) && alertas.find(i=>i.name=="tip1")!=undefined){
				let index=alertas.findIndex(i=>i.name=="tip1");
				
				alertas.splice(index, 1);
				//io.emit("alerta", alertas);				
				hayAlertaCambio=true;
			}			

			//Si el radiador y la ventana estan encendidos y abiertos
			if(actuadores[3].state && actuadores[1].state && alertas.find(i=>i.name=="tip2")==undefined){
				alertas.push({name: "tip2", msg:"Radiador encendido y ventana abierta, es recomendable realizar una acción"});
				//io.emit("alerta", alertas);				
				hayAlertaCambio=true;
			}
			else if(!(actuadores[3].state && actuadores[1].state) && alertas.find(i=>i.name=="tip2")!=undefined){
				let index=alertas.findIndex(i=>i.name=="tip2");
				
				alertas.splice(index, 1);
				//io.emit("alerta", alertas);				
				hayAlertaCambio=true;
			}						

			//Si el radiador y el aire acondicionado estan encendidos
			if(actuadores[3].state && actuadores[0].state && alertas.find(i=>i.name=="tip3")==undefined){
				alertas.push({name: "tip3", msg:"Radiador y aire acondicionado encendidos, se recomienda realizar una acción"});
				//io.emit("alerta", alertas);				
				hayAlertaCambio=true;
			}
			else if(!(actuadores[3].state && actuadores[0].state) && alertas.find(i=>i.name=="tip3")!=undefined){
				let index=alertas.findIndex(i=>i.name=="tip3");
				
				alertas.splice(index, 1);
				//io.emit("alerta", alertas);				
				hayAlertaCambio=true;
			}						

			//Si el humidificador y el deshumidificador estan encendidos
			if(actuadores[2].state && actuadores[4].state && alertas.find(i=>i.name=="tip4")==undefined){
				alertas.push({name: "tip4", msg:"Humidificador y deshumidificador encendidos, se recomienda realizar una acción"});
				//io.emit("alerta", alertas);				
				hayAlertaCambio=true;
			}
			else if(!(actuadores[2].state && actuadores[4].state) && alertas.find(i=>i.name=="tip4")!=undefined){
				let index=alertas.findIndex(i=>i.name=="tip4");
				
				alertas.splice(index, 1);
				//io.emit("alerta", alertas);				
				hayAlertaCambio=true;
			}

			if(hayAlertaCambio)
				io.emit("alerta", alertas);
		}

		/**
		 * Encargado de comprobar que no se superen los limites impuestos para los sensores.
		 * En caso de superarlos, se manda una alerta, y en caso extremos, se acciona el
		 * actuador mas adecuado para la situacion.
		 * 
		 * @param data El sensor que se va a comprobar
		 */
		function comprobarSensor(data){
			let hayAlertaCambio=false;

			//Si se superan los limites se muestra una advertencia
			if(data.currentValue>=data.highWarningValue && alertas.find(i=>(i.id==data.id && !i.low))==undefined){
				alertas.push({id: data.id, name: data.name, msg: data.maxWarningMsg, low: false});
				hayAlertaCambio=true;
			}
			else if(data.currentValue<data.highWarningValue && alertas.find(i=>(i.id==data.id && !i.low))!=undefined){
				let index=alertas.findIndex(i=>i.id==data.id);
				alertas.splice(index, 1);
				hayAlertaCambio=true;
			}
			
			if(data.currentValue<=data.lowWarningValue && alertas.find(i=>(i.id==data.id && i.low))==undefined){
				alertas.push({id: data.id, name: data.name, msg: data.minWarningMsg, low: true});
				hayAlertaCambio=true;
			}
			else if(data.currentValue>data.lowWarningValue && alertas.find(i=>(i.id==data.id && i.low))!=undefined){
				let index=alertas.findIndex(i=>i.id==data.id);
				alertas.splice(index, 1);
				hayAlertaCambio=true;
			}			


			//Parte de accionar actuadores dependiendo de los valores
			//Si se llega al maximo de temperatura o de lumens, se cierra la persiana (OFF en la GUI)
			if((sensores[0].currentValue>=sensores[0].redValue || sensores[1].currentValue>=sensores[1].redValue) && (actuadores[1].state 
				|| !actuadores[0].state || actuadores[3].state)){

				actuadores[1].state=false;
				io.emit("cambio-actuador", actuadores[1]);

				//Parte extra, se pone el aire acondicionado y se quita el radiador
				actuadores[0].state=true;
				io.emit("cambio-actuador", actuadores[0]);

				actuadores[3].state=false;
				io.emit("cambio-actuador", actuadores[3]);

				//Si antes estaban los dos accionados, habia una alerta, por lo que se debe eliminar
				if(alertas.find(i=>i.name=="tip")!=undefined){
					let index=alertas.findIndex(i=>i.name=="tip");
					alertas.splice(index, 1);
					//io.emit("alerta", alertas);					
					hayAlertaCambio=true;
				}
			}

			//Si se llega a un maximo de humedad, se acciona el deshumidificador y se apaga el humidificador (si no lo estaba)
			if(sensores[2].currentValue>=sensores[2].redValue && (!actuadores[2].state || actuadores[4].state)){
				actuadores[2].state=true;
				actuadores[4].state=false;

				io.emit("cambio-actuador", actuadores[2]);
				io.emit("cambio-actuador", actuadores[4]);

				if(alertas.find(i=>i.name=="tip4")!=undefined){
					let index=alertas.findIndex(i=>i.name=="tip4");
					alertas.splice(index, 1);
					//io.emit("alerta", alertas);		
					hayAlertaCambio=true;			
				}				
			}

			//Si se llega a un minimo de humedad, se acciona el humidificador y se apaga el deshumidificador (si no lo estaba)
			if(sensores[2].currentValue<=sensores[2].blueValue && (!actuadores[4].state || actuadores[2].state)){
				actuadores[2].state=false;
				actuadores[4].state=true;

				io.emit("cambio-actuador", actuadores[2]);
				io.emit("cambio-actuador", actuadores[4]);

				if(alertas.find(i=>i.name=="tip4")!=undefined){
					let index=alertas.findIndex(i=>i.name=="tip4");
					alertas.splice(index, 1);					
					hayAlertaCambio=true;
				}				
			}

			//Si se llega a un minimo de temperatura, se acciona el radiador, se apaga el aire y se cierran las ventanas
			if(sensores[0].currentValue<=sensores[0].blueValue && (!actuadores[3].state || actuadores[0].state || actuadores[1].state)){	//la segunda parte es nueva
				actuadores[0].state=false;
				actuadores[1].state=false;
				actuadores[3].state=true;

				io.emit("cambio-actuador", actuadores[0]);
				io.emit("cambio-actuador", actuadores[1]);
				io.emit("cambio-actuador", actuadores[3]);

				//Si existian alertas por conflicto de actuadores, se eliminan
				if(alertas.find(i=>i.name=="tip1")!=undefined){
					let index=alertas.findIndex(i=>i.name=="tip1");
					alertas.splice(index, 1);
					hayAlertaCambio=true;
				}

				if(alertas.find(i=>i.name=="tip2")!=undefined){
					let index=alertas.findIndex(i=>i.name=="tip2");
					alertas.splice(index, 1);
					hayAlertaCambio=true;
				}				

				if(alertas.find(i=>i.name=="tip3")!=undefined){
					let index=alertas.findIndex(i=>i.name=="tip3");
					alertas.splice(index, 1);
					hayAlertaCambio=true;
				}				
			}

			//Si ha habido un cambio, se emiten las alertas a todos los clientes
			if(hayAlertaCambio)
				io.emit("alerta", alertas);
		}

		//Cuando se conecta un cliente, se mete su direccion y puerto en el array para ser mostrado. Ademas se emite a todos el cambio
		clientes.push({address:client.request.connection.remoteAddress, port:client.request.connection.remotePort});
		io.sockets.emit("clientes", clientes);

		//Se emiten las alertas actuales al cliente recien conectado
		client.emit("alerta", alertas);

		//Se emite el historial de cambios de sensor 
		collection.find().toArray(function(err, res){
			if(err)
				console.log("Error de base de datos");
			else
				client.emit("historial", res);	
		});		

		//Inicializa los HTML con todos los sensores
		client.emit("obtener-sensores", sensores);

		//Inicializa los HTML con los actuadores
		client.emit("obtener-actuadores", actuadores);

		//Obtiene el estado actual del boton de simulacion
		client.emit("get-boton-sim", estadoSim);

		//Se mandan todos los trazos del lienzo al cliente (solo pizarra)
		for(let i=0; i<canvas.length; i++)
			client.emit("update-pizarra", canvas[i]);


		//PARTE DE PIZARRA DIGITAL--------------------------------------------------
		//Se guarda el nuevo trazo y se retransmite a todos para que se actualice
		client.on("update-pizarra", (data)=>{
			canvas.push(data);

			io.emit("update-pizarra", data);
		});

		//Cuando se pulsa el boton de limpiar lienzo se vacia el array y se retransmite el cambio
		client.on("limpiar-lienzo", ()=>{
			canvas=[];

			io.emit("limpiar-lienzo");
		})
		//--------------------------------------------------------------------------

		client.on("recibir-todos-msg", (data)=>{
			usuarios.find({name: data.name, passwd: data.passwd}).toArray(function(err, res){
				if(err)
					console.log("Error de base de datos");
				
				else if(res.length>0){
					msgDB.find().toArray(function(err, res){
						if(err)
							console.log("Error de base de datos");
						else
							client.emit("recibir-todos-msgs", res);
					});
				}
			});
		});


		//PARTE DE CHAT-----------------------------------------------
		/**
		 * Comprueba si una cuenta existe en la base de datos cuando se intenta iniciar sesion
		 */
		client.on("comprobar-cuenta", (data)=>{
			usuarios.find({name: data.name, passwd: data.passwd}).toArray(function(err, res){
				if(err)
					console.log("Error de base de datos");
				else
					client.emit("comprobar-cuenta", res.length);
			});
		})

		/**
		 * Permite registrar a un usuario nuevo, y en caso de existir ya ese nombre, no se crea
		 */
		client.on("crear-cuenta", (data)=>{
			usuarios.find({name: data.name}).toArray(function(err, res){
				if(err)
					console.log("Error de base de datos");
				else{
					if(res.length==0){
						usuarios.insertOne({name: data.name, passwd: data.passwd}, function(err, res){
							if(err)
								console.log("Error de base de datos");
							else
								client.emit("crear-cuenta", true);		//Todo OK
						});
					}
					else{
						client.emit("crear-cuenta", false);		//Ha habido un error
					}
				}
			});
		})

		/**
		 * Permite recibir un mensaje y mandarselo al resto
		 */
		client.on("recibir-msg", (data)=>{
			usuarios.find({name: data.user, passwd: data.passwd}).toArray(function(err, res){
				if(err)
					console.log("Error de base de datos");
				else{
					if(res.length!=0){
						let resRegistro={msg: data.msg,
							fecha: data.fecha, 
							user: data.user + " ("+client.request.connection.remoteAddress+":"+client.request.connection.remotePort+")",
							};
		
						msgDB.insertOne(resRegistro, function(err, res){
							if(err)
								console.log("Error de base de datos");
							else{
								io.emit("recibir-msg", resRegistro);
							}
						});
					}
				}
			});

			//}
		})		
		//-----------------------------------------------

		/**
		 * Añade un sensor nuevo a la lista. Como desventaja, debido a la implementacion,
		 * no puede interactuar con actuadores, pero si puede cambiarse su valor.
		 */
		client.on("add-sensor", (data)=>{
			data.id=sensores.length+1;

			sensores.push(data);
			io.emit("obtener-sensores", sensores);
		});

		//PARTE DE SIMULACION
		/**
		 * Evento que se activa cuando se pulsa el boton de comenzar simulacion
		 */
		client.on("comenzar-sim", ()=>{
			interval=setInterval(()=>{
				let tempDelta=0;
	
				//Se añaden los valores de los distintos actuadores
				if(actuadores[0].state)
					tempDelta--;
				
				if(actuadores[1].state)
					tempDelta+=0.5;
				
				if(actuadores[3].state)
					tempDelta++;
	
				//En caso de estar todo off, por defecto sube 0.5
				if(!actuadores[0].state && !actuadores[1].state && !actuadores[3].state)
					tempDelta=0.5;
				
				//Para evitar errores de redondeo, se pone al maximo o al minimo
				if(sensores[0].currentValue+tempDelta>=sensores[0].blueValue && sensores[0].currentValue+tempDelta<=sensores[0].redValue)
					sensores[0].currentValue+=tempDelta;
				else if(sensores[0].currentValue+tempDelta<sensores[0].blueValue)
					sensores[0].currentValue=sensores[0].blueValue;
				else
					sensores[0].currentValue=sensores[0].redValue;
				
	
				//Parte de luminosidad
				if(actuadores[1].state)
					sensores[1].currentValue=sensores[1].highWarningValue;
				else
					sensores[1].currentValue=sensores[1].blueValue;
	
				//Parte de humedad
				let humedadDelta=0;
	
				//Se acumulan los valores de los distintos actuadores
				if(actuadores[2].state)
					humedadDelta--;
				if(actuadores[4].state)
					humedadDelta++;
	
				//Si estan apagados se reduce 0.5 cada vez
				if(!actuadores[2].state && !actuadores[4].state)
					humedadDelta=-0.5;

				//Lo mismo que antes, para evitar errores de redondeo y se quede parada la humedad
				if(sensores[2].currentValue+humedadDelta>=sensores[2].blueValue && sensores[2].currentValue+humedadDelta<=sensores[2].redValue)
					sensores[2].currentValue+=humedadDelta;
				else if(sensores[2].currentValue+tempDelta<sensores[2].blueValue)
					sensores[2].currentValue=sensores[2].blueValue;
				else
					sensores[2].currentValue=sensores[2].redValue;
	
				//Se emiten todos los cambios en los sensores
				io.emit("cambio-sensor", sensores[0]);
				io.emit("cambio-sensor", sensores[1]);
				io.emit("cambio-sensor", sensores[2]);
	
				//Se emiten las alertas correspondientes y se accionan los actuadores correspondientes
				comprobarSensor(sensores[0]);
				comprobarSensor(sensores[1]);
				comprobarSensor(sensores[2]);

				//Ademas se comprueba si hay algunos actuadores incompatibles (explicado anteriormente)
				comprobarActuador();
			}, 2000);

			estadoSim=true;
			io.emit("get-boton-sim", true);		//Se emite el nuevo estado del boton
		});

		/**
		 * Permite parar la simulacion cuando se pulsa de nuevo el boton
		 */
		client.on("parar-sim", ()=>{
			clearInterval(interval);
			interval=null;

			estadoSim=false;
			io.emit("get-boton-sim", false);		//Se emite el nuevo estado
		});
		//FIN PARTE DE SIM


		/**
		 * Evento que capta cuando se realiza un cambio en un actuador. Ademas comprueba 
		 * si se ha producido alguna alerta.
		 */
		client.on("cambio-actuador", (data)=>{
			let index=actuadores.findIndex(i=>i.id==data.id);

			actuadores.splice(index, 1, data);

			io.emit("cambio-actuador", data);

			comprobarActuador();
		});

		/**
		 * Evento que se activa cuando se produce un cambio en la medicion de un sensor
		 * pasado como parametro.
		 */
		client.on("cambio-sensor", (data)=>{
			let index=sensores.findIndex(i=>i.id==data.id);
			//console.log(sensores[index]);

			//Se comprueba si se han superado los limites inferior o superior
			if(data.currentValue>sensores[index].maxValue)
				sensores[index].currentValue=sensores[index].maxValue;

			else if(data.currentValue<sensores[index].minValue)
				sensores[index].currentValue=sensores[index].minValue;

			else
				sensores[index].currentValue=data.currentValue;
			
			//Multicast a los clientes del cambio
			io.emit("cambio-sensor", sensores[index]);

			//Insercion de lo realizado en la base de datos
			//No se envian datos actualizados debido a que no se han propagado aun
			//La solucion es mandar directamente los mismos datos que se han insertado
			//en la base de datos
			let fecha=new Date();
			collection.insertOne({evento: sensores[index].sensorName, valor: sensores[index].currentValue, fecha: fecha}, function(err, res){
				if(err)
					console.log("Error de base de datos");
				else{
					//Se envia directamente a todos los conectados el nuevo cambio, 
					//asi se evita sobrecargar la base de datos
					io.emit("nuevo-registro", {evento: sensores[index].sensorName, valor: sensores[index].currentValue, fecha: fecha});
				}
			});		



			comprobarSensor(sensores[index]);		//Se actualizan las alertas
			comprobarActuador();
		});

		/**
		 * Accion que elimina un sensor, esto conlleva eliminar sus posibles alertas tambien
		 */
		client.on("delete-sensor", (data)=>{
			//Igualmente se comprueba en el servidor
			if(data!="temperatura" && data!="lumens" && data!="humedad" && data!=""){
				let index=sensores.findIndex(i=>i.name==data);
				sensores.splice(index, 1);

				io.emit("obtener-sensores", sensores);

				if(alertas.find(i=>i.name==data)!=undefined){
					alertas.splice(alertas.findIndex(i=>i.name==data), 1);
					io.emit("alerta", alertas);
				}
			}
		})

		/**
		 * Permite obtener un sensor dado su nombre
		 */
		client.on("obtener-sensor", (data)=>{
			let objeto=sensores.find(i=>i.name===data);
			client.emit("obtener-sensor", objeto);
		});

		/**
		 * Permite obtener un sensor dado su id
		 */
		client.on("obtener-sensor-id", (data)=>{
			let objeto=sensores.find(i=>i.id===data);

			client.emit("obtener-sensor-id", objeto);
		});

		/**
		 * Acciones que realiza al desconectarse un cliente
		 */
		client.on("disconnect", ()=>{
			let indice=-1;
	
			for(let i=0; i<clientes.length && indice==-1; i++){
				if(clientes[i].address==client.request.connection.remoteAddress
					&& clientes[i].port==client.request.connection.remotePort){
						indice=i;
					}
			}
	
			if(indice!=-1){
				clientes.splice(indice, 1);
				io.sockets.emit("clientes", clientes);
			}
		});
	});
})

