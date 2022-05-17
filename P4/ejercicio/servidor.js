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
		name: "temperatura",		//el id html
		unit: "°C",		//la unidad
		warningValue: 30,
		warningMsg: "Temperatura peligrosamente alta, considere tomar medidas",
		maxValue: 40,
		imageDir: null,
		currentValue: 0,
		deviceState: false,
		deviceName: "Aire acondicionado"
	},
	{
		id: 2,
		name: "lumens",
		unit: "lumens",
		warningValue: 1000,
		warningMsg: "Luminosidad peligrosamente alta, considere tomar medidas",
		maxValue: 2000,
		imageDir: null,
		currentValue: 0,
		deviceState: false,
		deviceName: "Persiana ventana"
	}	
]

//console.log(sensores.length);

/**
 * cambio-sensor: sustituira a los antiguos de los dos sensores, se le pasa un json
 * 
 */


MongoClient.connect("mongodb://localhost:27017/", {useUnifiedTopology: true}, function(err, db){
	let dbo = db.db("DSD_Practica_4");

	let collection=dbo.collection("accionesSensores");

	io.sockets.on('connection', (client) => {
		clientes.push({address:client.request.connection.remoteAddress, port:client.request.connection.remotePort});
		io.sockets.emit("clientes", clientes);

		client.emit("alerta", alertas);
		collection.find().toArray(function(err, res){
			client.emit("historial", res);	
		});		

		client.emit("obtener-sensores", sensores);

		for(let i=0; i<sensores.length; i++)
			client.emit("cambio-sensor", sensores[i]);

		console.log(sensores);

		client.on("add-sensor", (data)=>{
			data.id=sensores.length+1;

			sensores.push(data);
			io.emit("obtener-sensores", sensores);
		});

		//Aqui solo se pasa el propio json, no el array
		client.on("cambio-sensor", (data)=>{
			//console.log(sensores);
			//console.log(clientes.length)
			let index=sensores.findIndex(i=>i.id==data.id);
			let cambioValor=(data.currentValue==sensores[index].currentValue)? false : true;
			//console.log(index)

			//Inserta el nuevo estado del sensor pasado
			sensores.splice(index, 1, data);
			
			//Multicast a los clientes del cambio
			io.emit("cambio-sensor", data);

			//Insercion de lo realizado en la base de datos
			//No se envian datos actualizados debido a que no se han propagado aun
			if(cambioValor){
				//console.log("entra culiao");
				collection.insertOne({evento: data.name, valor: data.currentValue, fecha: new Date()});
				
				//Envia el historial de cambios en la base de datos
				collection.find().toArray(function(err, res){
					//console.log(res.length);					
					io.emit("historial", res);
				});			
			}

			//Si se superan los limites se muestra una advertencia
			if(data.currentValue>=data.warningValue && alertas.find(i=>i.id==data.id)==undefined){
				//console.log("alerta importante del gobierno")
				alertas.push(data);
				io.emit("alerta", alertas);
			}
			else if(data.currentValue<data.warningValue && alertas.find(i=>i.id==data.id)!=undefined){
				let index=alertas.findIndex(i=>i.id==data.id);
				alertas.splice(index, 1);
				io.emit("alerta", alertas);
			}

			//Si se llega al maximo de temperatura, se cierra la persiana (OFF en la GUI)
			if(sensores[0].currentValue>=sensores[0].maxValue && sensores[1].currentValue>=sensores[1].maxValue){
				sensores[1].deviceState=false;
				io.emit("cambio-sensor", sensores[1]);
			}

			//Si se tiene la ventana en ON y el aire en ON, se envia alerta
			if(sensores[0].deviceState && sensores[1].deviceState && alertas.find(i=>i.name=="tip")==undefined){
				alertas.push({name: "tip", warningMsg:"Es recomendable o cerrar la ventana o apagar el aire acondicionado"});
				io.emit("alerta", alertas);				
			}
			else if(alertas.find(i=>i.name=="tip")!=undefined){
				let index=alertas.findIndex(i=>i.name=="tip");
				
				alertas.splice(index, 1);
				io.emit("alerta", alertas);				
			}
		});

		/**
		 * Permite obtener todos los sensores que hay instalados en el hogar
		 */
		client.on("obtener-sensores", (data)=>{
			console.log("llamame")
			console.log(sensores);
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

		client.on("obtener-sensor-id", (data)=>{
			let objeto=sensores.find(i=>i.id===data);
			//console.log(objeto);

			client.emit("obtener-sensor-id", objeto);
			//console.log(objeto);
		});

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

