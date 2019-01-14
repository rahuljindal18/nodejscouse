/*
*
* Primary file for the API
*/

//Dependencies

var http = require("http");
var url = require("url");
var StringDecoder = require("string_decoder").StringDecoder;

//the server should respond to all requests with a string

var server = http.createServer(function(req,res){

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

   
    
});

//start the server and have it listen on port 3000

server.listen(3000, function(){
    console.log('Server is listeneing on port 3000 now');
});

//Define the handler
var handlers = {};

//Define sample handler
handlers.sample = function(data,callback){
    //callback a status code, and a payload object
    callback(406,{'name':'sample handler'});
};

//Not found handler
handlers.notFound = function(data,callback){
    callback(404);
};

//Define a request router
var router = {
    'sample' : handlers.sample
}