let http=require("http");
var url = require("url");
let fs = require("fs");
let path = require("path");
let socketio = require("socket.io");
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
io.sockets.on('connection', (client) => {
	console.log("conecta")

	clientes.push({address:client.request.connection.remoteAddress, port:client.request.connection.remotePort});
	io.emit("clientes", clientes);

	//Estas dos son necesarias para cuando se vuelve del formulario
	//ya que se produce una desconexion momentanea
	client.emit("cambio-temp", {temp: temp, tempWarning: tempWarning, maxTemp: maxTemp});
	client.emit("cambio-lumens", {lumens: lumens, lumensWarning: lumensWarning, maxLumens: maxLumens});
	client.emit("estado-persiana", estadoPersiana);
	client.emit("estado-AC", estadoAC);

	client.on('cambio-temp', (data)=>{
		temp=data;
		//console.log("cambio de temp");
		io.emit("cambio-temp", {temp: temp, tempWarning: tempWarning, maxTemp: maxTemp});

		//Comprobar que si se ha pasado el warning aumentar alerta

		if(temp>=maxTemp && lumens>=maxLumens){
			//console.log("muy caliente")
			estadoPersiana=false;
			io.emit("estado-persiana", estadoPersiana);
		}
	});

	client.on('cambio-lumens', (data)=>{
		lumens=data;
		console.log("cambio de lumens");
		io.emit("cambio-lumens", {lumens: lumens, lumensWarning: lumensWarning, maxLumens: maxLumens});

		if(temp>=maxTemp && lumens>=maxLumens){
			//console.log("muy caliente")
			estadoPersiana=false;
			io.emit("estado-persiana", estadoPersiana);
		}		
	});	


	client.on("estado-persiana", (data)=>{
		estadoPersiana=data;
		console.log("cambio de estado: "+estadoPersiana);

		io.emit("estado-persiana", estadoPersiana);
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
			io.emit("clientes", clientes);
		}
	});
});
