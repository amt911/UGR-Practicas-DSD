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
let temp=0;
let lumens=0;
let estadoAC=false;				//false=apagado
let estadoPersiana=true;		//false=bajado

const tempWarning=30;
const lumensWarning=1000;
const maxTemp=40;
const maxLumens=2000;

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
	//console.log(collection.find().toArray((err, res)=>console.log(res)));

	io.sockets.on('connection', (client) => {
		clientes.push({address:client.request.connection.remoteAddress, port:client.request.connection.remotePort});
		io.sockets.emit("clientes", clientes);

		//Estas dos son necesarias para cuando se vuelve del formulario
		//ya que se produce una desconexion momentanea
		//client.emit("cambio-temp", {temp: temp, tempWarning: tempWarning, maxTemp: maxTemp});
		//client.emit("cambio-lumens", {lumens: lumens, lumensWarning: lumensWarning, maxLumens: maxLumens});
		//client.emit("estado-persiana", estadoPersiana);
		//client.emit("estado-AC", estadoAC);
		client.emit("alerta", alertas);
		collection.find().toArray(function(err, res){
			client.emit("historial", res);	
		});		

		client.emit("obtener-sensores", sensores);

		for(let i=0; i<sensores.length; i++)
			client.emit("cambio-sensor", sensores[i]);

		//RECORDAR QUE AQUI SOLO SE PASA UN JSON, NO UN ARRAY DE JSON
		client.on("cambio-sensor", (data)=>{
			//console.log(clientes.length)
		
			//Inserta el nuevo estado del sensor pasado
			sensores.splice(sensores.findIndex(i=>i.name==data.name), 1, data);
			
			//Multicast a los clientes del cambio
			io.emit("cambio-sensor", data);

			//Insercion de lo realizado en la base de datos
			collection.insertOne({evento: data.name, valor: data.currentValue, fecha: new Date()});				//ARREGLAR PARA QUE SIGA EL ESTANDAR QUE HE DEFINIDO
			
			//Envia el historial de cambios en la base de datos
			collection.find().toArray(function(err, res){
				io.emit("historial", res);
			});

			//console.log(data);

			//Si se superan los limites se muestra una advertencia
			if(data.currentValue>=data.warningValue && alertas.find(i=>i.name==data.name)==undefined){
				//console.log("alerta importante del gobierno")
				alertas.push(data);
				io.emit("alerta", alertas);
			}
			else if(data.currentValue<data.warningValue && alertas.find(i=>i.name==data.name)!=undefined){
				let index=alertas.findIndex(i=>i.name==data.name);
				alertas.splice(index, 1);
				io.emit("alerta", alertas);
			}

			//Si se tiene la ventana en ON y el aire en ON, se envia alerta
			if(sensores[0].deviceState && sensores[1].deviceState){
				alertas.push({name: "tip", warningMsg:"Es recomendable o cerrar la ventana o apagar el aire acondicionado"});
				io.emit("alerta", alertas);				
			}
			else{
				let index=alertas.findIndex(i=>i.name=="tip");
				alertas.splice(index, 1);
				io.emit("alerta", alertas);				
			}


			if(sensores[0].currentValue>=sensores[0].maxValue && sensores[1].currentValue>=sensores[1].maxValue){
				sensores[1].deviceState=false;
				//io.emit("estado-persiana", estadoPersiana);
				io.emit("cambio-sensor", sensores[1]);
			}

		});

		/**
		 * Permite obtener todos los sensores que hay instalados en el hogar
		 */
		client.on("obtener-sensores", (data)=>{
			//console.log("llamame")
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

