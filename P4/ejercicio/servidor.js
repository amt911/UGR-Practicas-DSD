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

let clientes=[];
io.sockets.on('connection', (client) => {
	console.log("conecta")
	//io.sockets.emit("cambio-temp", temp);
	//io.sockets.emit("cambio-lumens", lumens);

	client.emit("cambio-temp", temp);
	client.emit("cambio-lumens", lumens);

	client.on('temperatura', (data)=>{
		temp=data;
		console.log("cambio de temp");
		io.emit("cambio-temp", temp);
	});

	client.on('lumens', (data)=>{
		lumens=data;
		console.log("cambio de lumens");
		io.emit("cambio-lumens", lumens);
	});	
});
