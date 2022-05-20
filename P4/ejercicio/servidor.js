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
let clientes=[];
let alertas=[];
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
		unit: "lumens",
		highWarningValue: 1000,
		maxWarningMsg: "Luminosidad peligrosamente alta, considere tomar medidas",
		redValue: 1800,
		maxValue: 2000,

		lowWarningValue: 500,
		minWarningMsg: "Luminosidad demasiado baja, considere abrir la ventana o encender la luz",
		blueValue: 200,
		minValue: 0,		
		imageDir: "sun.png",
		currentValue: 750,
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
]

//console.log(sensores.length);

/**
 * cambio-sensor: sustituira a los antiguos de los dos sensores, se le pasa un json
 * 
 */


/**
 * El chat sera un array donde se almacene: id, hora, mensaje
 */
let mensajes=[];		//Inicialmente sera un array de string
let usuariosRegistrados=[];	//Usuarios ya registrados
let interval, estadoSim=false;		//Usado para los intervalos
let canvas=[];
MongoClient.connect("mongodb://localhost:27017/", {useUnifiedTopology: true}, function(err, db){
	let dbo = db.db("DSD_Practica_4");

	let collection=dbo.collection("accionesSensores");
	let msgDB=dbo.collection("mensajesDB");
	//Teoricamente recibe la coleccion con los mensajes y usuarios registrados



	io.sockets.on('connection', (client) => {
		function funcion1A(){
			let hayAlertaCambio=false;

			//Si se tiene la ventana en ON y el aire en ON, se envia alerta
			if(actuadores[0].state && actuadores[1].state && alertas.find(i=>i.name=="tip1")==undefined){
				alertas.push({name: "tip1", msg:"Es recomendable o cerrar la ventana o apagar el aire acondicionado"});
				//io.emit("alerta", alertas);				
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

			//console.log("mec")
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

		function funcion2S(data){
			let hayAlertaCambio=false;

			//Si se superan los limites se muestra una advertencia
			if(data.currentValue>=data.highWarningValue && alertas.find(i=>(i.id==data.id && !i.low))==undefined){
				alertas.push({id: data.id, name: data.name, msg: data.maxWarningMsg, low: false});
				//io.emit("alerta", alertas);
				hayAlertaCambio=true;
			}
			else if(data.currentValue<data.highWarningValue && alertas.find(i=>(i.id==data.id && !i.low))!=undefined){
				let index=alertas.findIndex(i=>i.id==data.id);
				alertas.splice(index, 1);
				//io.emit("alerta", alertas);
				hayAlertaCambio=true;
			}
			
			if(data.currentValue<=data.lowWarningValue && alertas.find(i=>(i.id==data.id && i.low))==undefined){
				alertas.push({id: data.id, name: data.name, msg: data.minWarningMsg, low: true});
				//io.emit("alerta", alertas);
				hayAlertaCambio=true;
			}
			else if(data.currentValue>data.lowWarningValue && alertas.find(i=>(i.id==data.id && i.low))!=undefined){
				let index=alertas.findIndex(i=>i.id==data.id);
				alertas.splice(index, 1);
				//io.emit("alerta", alertas);
				hayAlertaCambio=true;
			}			


			//Parte de accionar actuadores dependiendo de los valores
			//Si se llega al maximo de temperatura o de lumens, se cierra la persiana (OFF en la GUI)
			if((sensores[0].currentValue>=sensores[0].redValue || sensores[1].currentValue>=sensores[1].redValue) && (actuadores[1].state 
				|| !actuadores[0].state || actuadores[3].state)){
					//console.log("aslkdjalskjlsadkfj")
				actuadores[1].state=false;
				//console.log(actuadores[1]);
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
				}				
			}
			//Estos dos (el de arriba y el de abajo) se pueden juntar
			//Si se llega a un minimo de humedad, se acciona el humidificador y se apaga el deshumidificador (si no lo estaba)
			if(sensores[2].currentValue<=sensores[2].blueValue && (!actuadores[4].state || actuadores[2].state)){
				actuadores[2].state=false;
				actuadores[4].state=true;

				io.emit("cambio-actuador", actuadores[2]);
				io.emit("cambio-actuador", actuadores[4]);

				if(alertas.find(i=>i.name=="tip4")!=undefined){
					let index=alertas.findIndex(i=>i.name=="tip4");
					alertas.splice(index, 1);
					//io.emit("alerta", alertas);					
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
					//io.emit("alerta", alertas);										
					hayAlertaCambio=true;
				}

				if(alertas.find(i=>i.name=="tip2")!=undefined){
					let index=alertas.findIndex(i=>i.name=="tip2");
					alertas.splice(index, 1);
					//io.emit("alerta", alertas);										
					hayAlertaCambio=true;
				}				

				if(alertas.find(i=>i.name=="tip3")!=undefined){
					let index=alertas.findIndex(i=>i.name=="tip3");
					alertas.splice(index, 1);
					//io.emit("alerta", alertas);										
				}				
			}

			if(hayAlertaCambio)
				io.emit("alerta", alertas);
		}

		clientes.push({address:client.request.connection.remoteAddress, port:client.request.connection.remotePort});
		io.sockets.emit("clientes", clientes);

		client.emit("alerta", alertas);
		collection.find().toArray(function(err, res){
			client.emit("historial", res);	
		});		

		client.emit("obtener-sensores", sensores);		//Inicializa los HTML con todos los sensores
		client.emit("obtener-actuadores", actuadores);	//Inicializa los actuadores

		msgDB.find().toArray(function(err, res){
			client.emit("recibir-todos-msgs", res);
		});


		client.emit("get-boton-sim", estadoSim);
		//console.log(sensores);



		//PARTE DE PINTAR--------------------------------
		console.log("canvas length: "+canvas.length)
		for(let i=0; i<canvas.length; i++)
			client.emit("update-pizarra", canvas[i]);

		client.on("update-pizarra", (data)=>{
			console.log(data);
			canvas.push(data);

			io.emit("update-pizarra", data);
		});

		client.on("limpiar-lienzo", ()=>{
			canvas=[];

			io.emit("limpiar-lienzo");
		})
		//-----------------------------------------------


		client.on("add-sensor", (data)=>{
			data.id=sensores.length+1;
			
			console.log(data);

			sensores.push(data);
			io.emit("obtener-sensores", sensores);
		});

		client.on("comenzar-sim", ()=>{
			interval=setInterval(()=>{
				let tempDelta=0;
	
				if(actuadores[0].state)
					tempDelta--;
				
				if(actuadores[1].state)
					tempDelta+=0.5;
				
				if(actuadores[3].state)
					tempDelta++;
	
				if(!actuadores[0].state && !actuadores[1].state && !actuadores[3].state)
					tempDelta=0.5;
				
				if(sensores[0].currentValue+tempDelta>=sensores[0].blueValue && sensores[0].currentValue+tempDelta<=sensores[0].redValue)
					sensores[0].currentValue+=tempDelta;
				else if(sensores[0].currentValue+tempDelta<sensores[0].blueValue)
					sensores[0].currentValue=sensores[0].blueValue;
				else
					sensores[0].currentValue=sensores[0].redValue;
				
	
				//Parte de luminosidad
				if(actuadores[1].state)
					sensores[1].currentValue=1500;
				else
					sensores[1].currentValue=0;
	
				//Parte de humedad
				let humedadDelta=0;
	
				if(actuadores[2].state)
					humedadDelta--;
				if(actuadores[4].state)
					humedadDelta++;
	
				if(!actuadores[2].state && !actuadores[4].state)
					humedadDelta=-0.5;

				if(sensores[2].currentValue+humedadDelta>=sensores[2].blueValue && sensores[2].currentValue+humedadDelta<=sensores[2].redValue)
					sensores[2].currentValue+=humedadDelta;
				else if(sensores[2].currentValue+tempDelta<sensores[2].blueValue)
					sensores[2].currentValue=sensores[2].blueValue;
				else
					sensores[2].currentValue=sensores[2].redValue;
	
				io.emit("cambio-sensor", sensores[0]);
				io.emit("cambio-sensor", sensores[1]);
				io.emit("cambio-sensor", sensores[2]);
	
				//Sirve para comprobar que no se pase el limite
				funcion2S(sensores[0]);
				funcion2S(sensores[1]);
				funcion2S(sensores[2]);

				funcion1A();
			}, 2000);

			//console.log("xdddddddddddddddddddddddd");
			estadoSim=true;
			io.emit("get-boton-sim", true);
		});

		client.on("parar-sim", ()=>{
			clearInterval(interval);
			interval=null;

			estadoSim=false;
			io.emit("get-boton-sim", false);
		});


		//PARTE ACTUADORES NUEVO-----------------------------
		client.on("obtener-actuadores", ()=>{
			client.emit("obtener-actuadores", actuadores);
		})


		/**
		 * Evento que capta cuando se realiza un cambio en un actuador. Ademas comprueba 
		 * si se ha producido alguna alerta.
		 */
		client.on("cambio-actuador", (data)=>{
			let index=actuadores.findIndex(i=>i.id==data.id);

			actuadores.splice(index, 1, data);

			io.emit("cambio-actuador", data);

			funcion1A();
		});

		client.on("obtener-actuador-id", (data)=>{
			client.emit("obtener-actuador-id", actuadores.find(i=>i.id==data));
		});
		//---------------------------------------------------

		//PARTE CHAT-----------------------------------------
		client.on("recibir-msg", (data)=>{
			let res={msg: data.msg,
				fecha: data.fecha, 
				user: client.request.connection.remoteAddress+":"+client.request.connection.remotePort,
				};
			//mensajes.push(res);
			msgDB.insertOne(res);

			io.emit("recibir-msg", res);
		})
		//---------------------------------------------------

		//Aqui solo se pasa el propio json, no el array
		client.on("cambio-sensor", (data)=>{
			let index=sensores.findIndex(i=>i.id==data.id);

			//Inserta el nuevo estado del sensor pasado
			sensores.splice(index, 1, data);
			
			//Multicast a los clientes del cambio
			io.emit("cambio-sensor", data);		//NO LO ENTIENDO, REVISAR

			//Insercion de lo realizado en la base de datos
			//No se envian datos actualizados debido a que no se han propagado aun
			collection.insertOne({evento: data.name, valor: data.currentValue, fecha: new Date()});
			
			//Envia el historial de cambios en la base de datos
			collection.find().toArray(function(err, res){
				io.emit("historial", res);
			});			

			funcion2S(data);
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
		 * Permite obtener todos los sensores que hay instalados en el hogar
		 */
		client.on("obtener-sensores", (data)=>{
			//console.log("llamame")
			//console.log(sensores);
			client.emit("obtener-sensores", sensores);
		});

		/**
		 * Permite obtener un sensor dado su nombre
		 */
		client.on("obtener-sensor", (data)=>{
			let objeto=sensores.find(i=>i.name===data);
			client.emit("obtener-sensor", objeto);
			//console.log(objeto);
		});

		/**
		 * Permite obtener un sensor dado su id
		 */
		client.on("obtener-sensor-id", (data)=>{
			let objeto=sensores.find(i=>i.id===data);
			//console.log(objeto);

			client.emit("obtener-sensor-id", objeto);
			//console.log(objeto);
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

