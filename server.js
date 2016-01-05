// ===================
// ==== SERVER.JS ====
// ===================

//required modules + setup
var express = require('express');
var bodyParser = require('body-parser');
var auth = require('basic-auth');
var colors = require('colors');

//external dummy json data module
var dummy_data = require('./public/models/dummy_data.js');

//initialize express
var app = express();

//global variables
var port = process.argv[2];

//TODO load date from file.

//TODO Data logging to file.

////BASIC GLOBAL AUTHENTICATION (example, not production ready)
//app.use(function(request, response, next){
//    var credentials = auth(request);
//    if(!credentials || credentials.name !== 'admin' || credentials.pass !== 'password2') {
//        response.statusCode = 401;
//        response.setHeader('WWW-Authenticate', 'Basic realm="example"');
//        response.end('Acess Denied');
//    } else {
//        response.send('this is working!');
//    }
//});

//start serving static files
app.use(express.static(__dirname + '/public'));

//tell app to use body-parser middleware
app.use(bodyParser.json());
//app.use(bodyParser.text());

// = CONSOLE LOGGING MIDDLEWARE =
// auto runs every time, sequence is important
app.use(function(request, response, next){
    console.log('%s %s %s', request.method, request.url, request.path);
    next();
});

//= define API routes =
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

// = RETURN RANDOM QUOTE =
app.get('/quote/random', function(request, response){
    var id = Math.floor(Math.random() * dummy_data.quotes.length);
    var q = dummy_data.quotes[id];
    response.json(q);
    console.log(colors.blue('client requested a random quote: ' + JSON.stringify(q)));
});

// = RETURN REQUEST QUOTE USING ID
app.get('/quote/:id', function(request, response){

    // = ERROR HANDLING =
    //Check to see if input is within range...
    //if amount of quotes is less than or equal to input ID,
    //OR the input ID is less than 0 (meaning no input)...
    if(dummy_data.quotes.length <= request.params.id || request.params.id < 0) {
        response.statusCode = 404;
        return response.send('Error 404: No quote found!');
    }

    //if no errors, respond with json file
    var q = dummy_data.quotes[request.params.id];
    response.json(q);
});

// DEBUG ROUTE WITH PARAMETERS
app.get('/debug/:id', function(request, response){
    response.type('text/plain');
    response.send('debug - you entered: "' + request.params.id +'"');
});

// POST DATA TO SERVER
app.post('/quote', function(request, response) {
    if(!request.body.hasOwnProperty('author') || !request.body.hasOwnProperty('text')) {
        response.statusCode = 400;
        return response.send('Error 400: Post syntax incorrect');
    }

    else {
        //log out data
        console.log(request.body.author + ': ' + request.body.text);

        //grab incoming POST data
        var newQuote = {'author': request.body.author, 'text': request.body.text};

        //push new quote to quotes array
        dummy_data.quotes.push(newQuote);
        response.json(true);    //pass back SOMETHING otherwise frontend will error
    }
});

//TODO delete data from server using POST

//TODO create custom 404 error handling via: https://www.safaribooksonline.com/blog/2014/03/12/error-handling-express-js-applications/

//start the server
init();


//== CUSTOM FUNCTIONS ==
function init() {
    console.log(colors.green('starting server on ' + port + ', running on a ' + process.arch + ' machine.' ));
    app.listen(port || 8000);
}