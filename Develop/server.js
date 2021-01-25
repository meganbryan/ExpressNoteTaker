var express = require("express");
const { fstat } = require("fs");
var path = require("path");
var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var notesArray = [];

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/api/notes", function(req, res) {
    fstat.readFile('db.json', (err, data) => {
        if (err) throw err;
        console.log(data);
    })
});

app.post("/api/notes/:id", function(req, res) {
    var newNote = req.body;
    newNote.routeName = newNote.name.replace(/\s+/g, "").toLowerCase();
    console.log(newNote);
    notesArray.push(newNote);
    res.json(newNote);
});

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});