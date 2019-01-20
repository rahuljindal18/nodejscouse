/*
*
* Primary file for the API
*/

//Dependencies

var http = require("http");
var https = require('https');
var url = require("url");
var StringDecoder = require("string_decoder").StringDecoder;
var config = require('./config');
var fs = require('fs');
// var _data = require('./lib/data');

//Testing
//@TODO delete this

// _data.create('test','newFile',{"foo":"bar"},function(err){
//     console.log("this was the error",err);
// });

// _data.read('test','newFile',function(err,data){
//     console.log("this was the error",err , " and this was the data",data);
// });

//  _data.update('test','newFile',{"fizz":"buzz"},function(err){
//      console.log("this was the error",err);
//  });

//  _data.delete('test','newFile',function(err){
//      console.log("this was the error",err );
//  });

//Instantiate the http server

var httpServer = http.createServer(function(req,res){
    unifiedServer(req,res);    
});

//start the http server

httpServer.listen(config.httpPort, function(){
    console.log('Server is listeneing on port '+config.httpPort+' in '+config.envName+' mode');
});

//Instantiate the https server
var httpsServerOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem')
}
var httpsServer = https.createServer(httpsServerOptions,function(req,res){
    unifiedServer(req,res); 
});

//Start the https server
httpsServer.listen(config.httpsPort, function(){
    console.log('Server is listeneing on port '+config.httpsPort+' in '+config.envName+' mode');
});


//All the server logic for https and http server

var unifiedServer = function(req,res){
    //get the url and parse it
    var parsedUrl = url.parse(req.url,true);

    //get the path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g,'');

    //get the query string as the object
    var queryStringObject = parsedUrl.query;

    //get the http method
    var method = req.method.toLowerCase();

    //get the headers as an object
    var headers = req.headers;

    //get the payload if any
    var decoder = new StringDecoder("utf-8");
    var buffer = '';
    req.on('data',function(data){
        buffer += decoder.write(data);
    });

    req.on('end',function(){
        buffer += decoder.end();

        //choose the handler this request should go to, if not found go to notfound handler
        var chooseHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        //construct the data object to send to the handler
        var data = {
            "trimmedPath" : trimmedPath,
            "queryStringObject" : queryStringObject,
            "method":method,
            "headers":headers,
            "payload":buffer
        }

        //route the request specified in the router
        chooseHandler(data,function(statusCode,payload){

            //use the status code called back by the handler, or use the default status code 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            //use the payload called back by the handler, or use the payload as empty object
            payload = typeof(payload) == 'object'?payload:{};

            //convert the payload to a string
            var payloadString = JSON.stringify(payload);

            //return the response
            res.setHeader('Content-Type','application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            console.log("returning this response ", statusCode,payloadString);
        });

        //send the response
        //res.end("Hello World\n");

        //log the request path
        console.log("Request received on this path : " + trimmedPath + " with method : " + method+' and with query string parameters',queryStringObject);
        console.log("Request headers received with request",headers);
        console.log("Request received with this payload",buffer);
    }); 
};

//Define the handler
var handlers = {};

//Define ping handler
handlers.ping = function(data,callback){
    callback(200);
};

//Not found handler
handlers.notFound = function(data,callback){
    callback(404);
};

//Define a request router
var router = {
    'ping' : handlers.ping
}