//server.js

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var colors = require('colors');
var port = process.argv[2];


//TODO load date from file.

//TODO Data logging to file.

//static data
var myData = [
    {
        "first":"jeff",
        "last":"wu",
        "title":"creative technlogist"
    },
    {
        "first":"shirley",
        "last":"yang",
        "title":"teacher"
    },
    {
        "first":"wynbert",
        "last":"gan",
        "title":"IT director"
    },
    {
        "first":"wayne",
        "last":"dong",
        "title":"IT specialist"
    }
];

var quotes = [
    { author : 'Audrey Hepburn', text : "Nothing is impossible, the word itself says 'I'm possible'!"},
    { author : 'Walt Disney', text : "You may not realize it when it happens, but a kick in the teeth may be the best thing in the world for you"},
    { author : 'Unknown', text : "Even the greatest was once a beginner. Don't be afraid to take that first step."},
    { author : 'Neale Donald Walsch', text : "You are afraid to die, and you're afraid to live. What a way to exist."}
];

//start serving static files
app.use(express.static(__dirname + '/public'));

//tell app to use body-parser
app.use(bodyParser.json());

//define routes
app.get('/subaru', function(request, response){
    response.type('text/plain');
    response.send('i am a subaru owner!' + ' on port ' + port);
    console.log(colors.blue('Someone requested the subaru page!'));
});

// == returns file == NOT WORKING ==
app.get('/subaru_logo', function(request, response){
    //response.type('image/jpg');
    response.sendFile(__dirname + '/public/img/subaru-cars-logo-emblem.jpg');
});

// == returns image ==
app.get('/subaru_message', function(request, response){
    response.type('text/html');
    response.send('<img src="/img/subaru-cars-logo-emblem.jpg" width="400px">');
    console.log(colors.blue('client requested subaru message'));
});

// == RETURN JSON DATA ==
app.get('/json', function(request, response){
    response.type('application/json');
    response.send(JSON.stringify(myData));
    console.log(colors.blue('client requested user data.'));

});

// == RETURN QUOTES ==
// using response.json() helper function
app.get('/quotes', function(request, response){
    response.json(quotes);
    console.log(colors.blue('client requested all quotes.'));

});

// = return random quote =
app.get('/quote/random', function(request, response){
    var id = Math.floor(Math.random() * quotes.length);
    var q = quotes[id];
    response.json(q);
    console.log(colors.blue('client requested a random quote: ' + JSON.stringify(q)));
});

// = return requested quote with ID
app.get('/quote/:id', function(request, response){

    // = ERROR HANDLING =
    //if amount of quotes is less than or equal to input ID,
    //OR the input ID is less than 0 (meaning no input)...
    if(quotes.length <= request.params.id || request.params.id < 0) {
        response.statusCode = 404;
        return response.send('Error 404: No quote found!');
    }

    //if not errored, respond with json file
    var q = quotes[request.params.id];
    response.json(q);
});

//debug route with parameters
app.get('/stuff/:id', function(request, response){
    response.type('text/plain');
    response.send('debug - you entered: "' + request.params.id +'"');
});

//TODO create POST method (2015.JAN.03)

//start the server
init();


//== CUSTOM FUNCTIONS ==
function init() {
    console.log(colors.green('starting server on ' + port + ', running on a ' + process.arch + ' machine.' ));
    app.listen(port || 8000);
}