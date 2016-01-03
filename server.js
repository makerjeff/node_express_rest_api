//server.js

var express = require('express');
var app = express();
var colors = require('colors');
var port = process.argv[2];

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

//define routes
app.get('/subaru', function(request, response){
    response.type('text/plain');
    response.send('i am a subaru owner!' + ' on port ' + port);
    console.log(colors.blue('Someone requested the subaru page!'));
});

// == returns file == NOT WORKING
app.get('/subaru_logo', function(request, response){
    response.type('image/jpg');
    response.send(__dirname + '/img/subaru-cars-logo-emblem.jpg');
});

// == returns image ==
app.get('/subaru_message', function(request, response){
    response.type('text/html');
    response.send('<img src="/img/subaru-cars-logo-emblem.jpg" width="400px">');
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
app.get('/quotes/random', function(request, response){
    var id = Math.floor(Math.random() * quotes.length);
    var q = quotes[id];
    response.json(q);
    console.log(colors.blue('client requested a random quote!'));
});

//TODO add parameters to routes

//start the server
init();


//== custom functions ==
function init() {
    console.log(colors.green('starting server on ' + port + ', running on a ' + process.arch + ' machine.' ));
    app.listen(port || 8000);
}