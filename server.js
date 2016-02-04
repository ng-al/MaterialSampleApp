"use strict";

var bodyParser = require("body-parser");
var configuration = require("./server/config.json");
var express = require("express");
var http = require("http");
var less = require("less-middleware");
var morgan = require("morgan");
var path = require("path");

// express
var app = express();

app.set("views", path.join(__dirname, "./server"));
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(less(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("combined"));

app.get("/leftNav.html", function(req, res){
    res.render("leftNav.ejs", {
        author: configuration.demo.author
    });
});

app.get("/materialConfig.js", function(req, res){
    res.render("materialConfig.ejs", {
        primaryPalette: configuration.demo.material.primaryPalette,
        accentPalette: configuration.demo.material.accentPalette
    });
});

app.get("/", function(req, res){
    res.render("index.ejs", {
        config: JSON.stringify(configuration.demo),
        title: configuration.demo.title
    });
});


app.get("*", function(req, res, next){
    next();
});

app.use(function(req, res, next){
    res.status(404);
    res.send("<h1>Not Found</h1><h2>404</h2>");
});


// server
var server = http.createServer(app);
var port = configuration.demo.port;
server.listen(port);

console.log("node.js server listening on port " + port);