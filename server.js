// ===================
// ==== SERVER.JS ====
// ===================

//required modules + setup
var express = require('express');
var bodyParser = require('body-parser');
var colors = require('colors');

//external dummy json data module
var dummy_data = require('./public/models/dummy_data.js');

//initialize express
var app = express();

//global variables
var port = process.argv[2];

//TODO load date from file.

//TODO Data logging to file.

//start serving static files
app.use(express.static(__dirname + '/public'));

//tell app to use body-parser
app.use(bodyParser.json());

// = CONSOLE LOGGING MIDDLEWARE =
// auto runs every time
app.use(function(request, response, next){
    console.log('%s %s %s', request.method, request.url, request.path);
    next();
});

//= define routes =
app.get('/subaru', function(request, response){
    response.type('text/plain');
    response.send('i am a subaru owner!' + ' on port ' + port);
    console.log(colors.blue('Someone requested the subaru page!'));
});

// == returns file ==
app.get('/subaru_logo', function(request, response){
    //response.type('image/jpg');
    response.sendFile(__dirname + '/public/img/subaru-cars-logo-emblem.jpg');
});

// == returns html with image ==
app.get('/subaru_message', function(request, response){
    response.type('text/html');
    response.send('<img src="/img/subaru-cars-logo-emblem.jpg" width="400px">');
    console.log(colors.blue('client requested subaru message'));
});

// == RETURN JSON DATA ==
app.get('/json', function(request, response){
    response.type('application/json');
    response.send(JSON.stringify(dummy_data.myData));
    console.log(colors.blue('client requested user data.'));

});

// == RETURN QUOTES ==
// using response.json() helper function
app.get('/quotes', function(request, response){
    response.json(dummy_data.quotes);
    console.log(colors.blue('client requested all quotes.'));

});

// = return random quote =
app.get('/quote/random', function(request, response){
    var id = Math.floor(Math.random() * dummy_data.quotes.length);
    var q = dummy_data.quotes[id];
    response.json(q);
    console.log(colors.blue('client requested a random quote: ' + JSON.stringify(q)));
});

// = return requested quote with ID
app.get('/quote/:id', function(request, response){

    // = ERROR HANDLING =
    //if amount of quotes is less than or equal to input ID,
    //OR the input ID is less than 0 (meaning no input)...
    if(dummy_data.quotes.length <= request.params.id || request.params.id < 0) {
        response.statusCode = 404;
        return response.send('Error 404: No quote found!');
    }

    //if not errored, respond with json file
    var q = dummy_data.quotes[request.params.id];
    response.json(q);
});

//debug route with parameters
app.get('/debug/:id', function(request, response){
    response.type('text/plain');
    response.send('debug - you entered: "' + request.params.id +'"');
});

//TODO create POST method (2015.JAN.03)

//TODO create custom 404 error handling via: https://www.safaribooksonline.com/blog/2014/03/12/error-handling-express-js-applications/

//start the server
init();


//== CUSTOM FUNCTIONS ==
function init() {
    console.log(colors.green('starting server on ' + port + ', running on a ' + process.arch + ' machine.' ));
    app.listen(port || 8000);
}