let http=require("http");
var url = require("url");
let fs = require("fs");
let path = require("path");
let socketio = require("socket.io");
var MongoClient = require('mongodb').MongoClient;
const { isObject } = require("util");
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

		lowWarningValue: 10,
		minWarningMsg: "Temperatura demasiado baja, considere activar el radiador",
		blueValue: 0,
		minValue: -60,		
		imageDir: null,
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
		minValue: 750,		
		imageDir: null,
		currentValue: 0,
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
		imageDir: null,
		currentValue: 55,
	}
]

let actuadores=[
	{
		id: 1,
		name: "Aire acondicionado",
		state: false,
		idName: "AC",
		img: "ac-off.jpg"
	},

	{
		id: 2,
		name: "Persiana",
		state: false,
		idName: "ventana",
		img: "per-down.jpg"
	},
	{
		id: 3,
		name: "Deshumidificador",
		state: false,
		idName: "deshumidificador",
		img: "per-down.jpg"
	},
	{
		id: 4,
		name: "Radiador",
		state: false,
		idName: "radiador",
		img: "per-down.jpg"
	},
	{
		id: 5,
		name: "Humidificador",
		state: false,
		idName: "humidificador",
		img: "per-down.jpg"
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
let interval;		//Usado para los intervalos
MongoClient.connect("mongodb://localhost:27017/", {useUnifiedTopology: true}, function(err, db){
	let dbo = db.db("DSD_Practica_4");

	let collection=dbo.collection("accionesSensores");
	//Teoricamente recibe la coleccion con los mensajes y usuarios registrados



	io.sockets.on('connection', (client) => {
		clientes.push({address:client.request.connection.remoteAddress, port:client.request.connection.remotePort});
		io.sockets.emit("clientes", clientes);

		client.emit("alerta", alertas);
		collection.find().toArray(function(err, res){
			client.emit("historial", res);	
		});		

		client.emit("obtener-sensores", sensores);		//Inicializa los HTML con todos los sensores
		client.emit("obtener-actuadores", actuadores);	//Inicializa los actuadores

		client.emit("recibir-msgs", mensajes);


		//console.log(sensores);

		client.on("add-sensor", (data)=>{
			data.id=sensores.length+1;
			
			console.log(data);

			sensores.push(data);
			io.emit("obtener-sensores", sensores);
		});
/*
		interval=setInterval(()=>{
				if(sensores[0].deviceState && sensores[1].deviceState)
					sensores[0].currentValue-=0.5;
				else if(!sensores[0].deviceState && sensores[1].deviceState)
					sensores[0].currentValue++;
				else if(sensores[0].deviceState && !sensores[1].deviceState)
					sensores[0].currentValue--;
				else if(!sensores[0].deviceState && !sensores[1].deviceState)
					sensores[0].currentValue+=0.5;

			io.emit("cambio-sensor", sensores[0]);
		}, 2000);
*/


		//PARTE ACTUADORES NUEVO-----------------------------
		client.on("obtener-actuadores", ()=>{
			client.emit("obtener-actuadores", actuadores);
		})


		client.on("cambio-actuador", (data)=>{
			let index=actuadores.findIndex(i=>i.id==data.id);

			actuadores.splice(index, 1, data);

			io.emit("cambio-actuador", data);

			console.log("ANTES ----------------------------------")
			console.log(actuadores[0]);
			console.log(actuadores[1]);
			console.log(actuadores[3]);
			console.log("ANTES ----------------------------------")

			//Si se tiene la ventana en ON y el aire en ON, se envia alerta
			if(actuadores[0].state && actuadores[1].state && alertas.find(i=>i.name=="tip1")==undefined){
				alertas.push({name: "tip1", maxWarningMsg:"Es recomendable o cerrar la ventana o apagar el aire acondicionado"});
				io.emit("alerta", alertas);				
			}
			else if(!(actuadores[0].state && actuadores[1].state) && alertas.find(i=>i.name=="tip1")!=undefined){
				console.log("1**********************")
				let index=alertas.findIndex(i=>i.name=="tip1");
				
				alertas.splice(index, 1);
				io.emit("alerta", alertas);				
			}			

			//Si el radiador y la ventana estan encendidos y abiertos
			if(actuadores[3].state && actuadores[1].state && alertas.find(i=>i.name=="tip2")==undefined){
				alertas.push({name: "tip2", maxWarningMsg:"Radiador encendido y ventana abierta, es recomendable realizar una acción"});
				io.emit("alerta", alertas);				
			}
			else if(!(actuadores[3].state && actuadores[1].state) && alertas.find(i=>i.name=="tip2")!=undefined){
				console.log("2**********************")
				let index=alertas.findIndex(i=>i.name=="tip2");
				
				alertas.splice(index, 1);
				io.emit("alerta", alertas);				
			}						

			//console.log("mec")
			//Si el radiador y el aire acondicionado estan encendidos
			if(actuadores[3].state && actuadores[0].state && alertas.find(i=>i.name=="tip3")==undefined){
				alertas.push({name: "tip3", maxWarningMsg:"Radiador y aire acondicionado encendidos, se recomienda realizar una acción"});
				io.emit("alerta", alertas);				
			}
			else if(!(actuadores[3].state && actuadores[0].state) && alertas.find(i=>i.name=="tip3")!=undefined){
				console.log("3**********************")
				let index=alertas.findIndex(i=>i.name=="tip3");
				
				alertas.splice(index, 1);
				io.emit("alerta", alertas);				
			}						

			//Si el humidificador y el deshumidificador estan encendidos
			if(actuadores[2].state && actuadores[4].state && alertas.find(i=>i.name=="tip4")==undefined){
				alertas.push({name: "tip4", maxWarningMsg:"Humidificador y deshumidificador encendidos, se recomienda realizar una acción"});
				io.emit("alerta", alertas);				
			}
			else if(!(actuadores[2].state && actuadores[4].state) && alertas.find(i=>i.name=="tip4")!=undefined){
				console.log("3**********************")
				let index=alertas.findIndex(i=>i.name=="tip4");
				
				alertas.splice(index, 1);
				io.emit("alerta", alertas);				
			}	

			console.log("DESPUES ----------------------------------")
			console.log(actuadores[0]);
			console.log(actuadores[1]);
			console.log(actuadores[3]);
			console.log(alertas.find(i=>i.name=="tip1"))
			console.log(alertas.find(i=>i.name=="tip2"))
			console.log(alertas.find(i=>i.name=="tip3"))			
			console.log("DESPUES ----------------------------------")
		});

		client.on("obtener-actuador-id", (data)=>{
			client.emit("obtener-actuador-id", actuadores.find(i=>i.id==data));
		});
		//---------------------------------------------------

		//PARTE CHAT-----------------------------------------
		client.on("enviar-msg", (data)=>{
			mensajes.push(data);

			io.emit("recibir-msgs", mensajes);
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

			//Si se superan los limites se muestra una advertencia
			if(data.currentValue>=data.highWarningValue && alertas.find(i=>i.id==data.id)==undefined){
				alertas.push(data);
				io.emit("alerta", alertas);
			}
			else if(data.currentValue<data.highWarningValue && alertas.find(i=>i.id==data.id)!=undefined){
				let index=alertas.findIndex(i=>i.id==data.id);
				alertas.splice(index, 1);
				io.emit("alerta", alertas);
			}

			//Si se llega al maximo de temperatura y de lumens, se cierra la persiana (OFF en la GUI)
			if(sensores[0].currentValue>=sensores[0].maxValue || sensores[1].currentValue>=sensores[1].maxValue){
				actuadores[1].state=false;
				//console.log(actuadores[1]);
				io.emit("cambio-actuador", actuadores[1]);

				//Parte extra, se pone el aire acondicionado tambien
				actuadores[0].state=true;
				io.emit("cambio-actuador", actuadores[0]);

				if(alertas.find(i=>i.name=="tip")!=undefined){
					let index=alertas.findIndex(i=>i.name=="tip");
					alertas.splice(index, 1);
					io.emit("alerta", alertas);					
				}
			}

		});

		/**
		 * Accion que elimina un sensor, esto conlleva eliminar sus posibles alertas tambien
		 */
		client.on("delete-sensor", (data)=>{
			//Igualmente se comprueba en el servidor
			if(data!="temperatura" && data!="lumens"){
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

