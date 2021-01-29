var express = require("express");
const fs = require("fs");
var path = require("path");
var uuid = require("uuid")
var app = express();
var PORT = process.env.PORT || 3050;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/notes", function(req, res) {
    fs.readFile("./db/db.json", (err, data) => {
        if (err) throw err;
        res.send(JSON.parse(data))
    });
});

app.post("/api/notes", function(req, res) {
    var newNote = req.body;
    newNote.id = uuid.v4()
    fs.readFile("./db/db.json", (err, data) => {
        if (err) throw err;
        let fileJSON = JSON.parse(data)
        fileJSON.push(newNote)
        fs.writeFile("./db/db.json", JSON.stringify(fileJSON), (err) => {
            if (err) throw err;
            res.status(200)
        })
    }) 
    res.redirect('back');
});

app.delete("/api/notes/:id", function(req, res) {
    const currentID = req.params.id
    fs.readFile("./db/db.json", (err, data) => {
        if (err) throw err;
        let fileJSON = JSON.parse(data)
        for (var i = 0; i < fileJSON.length; i++) {
            if (currentID === fileJSON[i].id) {
                fileJSON.splice(i, 1);
            }
        }
        fs.writeFile("./db/db.json", JSON.stringify(fileJSON), (err) => {
            if (err) throw err;
            res.status(200)
        })
    })
});

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});