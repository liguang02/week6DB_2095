let express = require("express");
// let ejs = require("ejs");
// const mongodb =require("mongodb");
let path = require('path');
const mongoose = require('mongoose');


let app = express();
const url = 'mongodb://localhost:27017/week6DB';


app.use(express.urlencoded({extended:true}));
app.use("/css", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")))
app.use("/js", express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")))
const Parcel = require('./models/parcel');

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.listen(8081);

// const MongoClient = mongodb.MongoClient;
// const url = "mongodb://localhost:27017/";

// let db;
// MongoClient.connect(url, {useNewUrlParser: true}, function(err, client){
//     if(err){
//         console.log('Err ',err);
//     }else{
//         console.log("Connected successfully to server");
//         db = client.db('Lab_POMS');
//     }
// })

mongoose.connect(url, function (err) {
    if (err === null) console.log('Connected Successfully');
   
        let parcel = new Parcel({ sender: 'Chai', address: 'Perth', weight: 2021, fragile: true });
        parcel.save(function (err) {
            if (err) console.log('Unable to save'+err) ;
            else console.log("Save Successfully");

        });
    
});

app.use(express.static('css'));
app.use(express.static('imgs'));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, "views/homepage.html"))
});
app.get('/new', function(req, res){
    res.sendFile(path.join(__dirname, "/views/new.html"))
});

app.get('/list', function(req, res){
    // res.sendFile(path.join(__dirname, "/views/list.html"));
    db.collection('parcel').find({}).toArray(function(err,data){
        res.render("list.html", {parcelDb: data});
    })
});


app.post('/newpost', function(req, res){
    let sender = req.body.sender;
    let address = req.body.address;
    let weight = parseInt(req.body.weight);
    let fragile = req.body.fragile;
    if(sender.length <3 || address.length <3 || weight <0){
        res.render("invalid.html")   
    }else{
    db.collection('parcel').insertOne({
        sender: sender,
        address: address,
        weight: weight,
        fragile: fragile
    });
    res.redirect('/list')
}
});

app.get("/delete", function(req, res){
    res.sendFile(path.join(__dirname, "/views/delete.html"))
});

app.post("/deleteParcel", function(req, res){
    let id = req.body.id;
    db.collection('parcel').deleteMany(
        
            {
                _id: mongodb.ObjectId(id) 
            }
    );
    res.redirect('/list');
});
app.get("/update", function(req, res){
    res.sendFile(path.join(__dirname, "/views/update.html"))
});

app.post("/updateParcel", function (req, res) {
    let parcelDetails = req.body;
    let filter = { _id: mongodb.ObjectId(parcelDetails.id) };
    let theUpdate = {
      $set: {
        sender: parcelDetails.sender,
        address: parcelDetails.address,
        weight: parcelDetails.weight,
        fragile: parcelDetails.fragile,
      },
    };
    db.collection("parcel").updateMany(filter, theUpdate);
    res.redirect("/list"); // redirect the client to list users page
  });

app.get("/updateWeight", function(req, res){
    res.sendFile(path.join(__dirname, "/views/updateWeight.html"))
});
app.post("/updateParcelWeight", function (req, res) {
    // let parcelDetails = req.body;
    let filter2 =  {sender: req.body.sender ,  weight: parseFloat(req.body.weight) }  ;
    let theUpdate = {
      $set: {
        sender: "Sender:" + req.body.sender} ,
        $inc: {weight: 5}
    
    };
    db.collection("parcel").updateMany(filter2, theUpdate);
    //     res.redirect("/list");

    res.redirect("/list"); // redirect the client to list users page
  });
// app.post('/updateParcelWeight', function(req, res) {
//     db.collection('parcel').updateMany({sender: req.body.sender, weight: parseFloat(req.body.weight)}, {$set: {sender: "Sender:"+req.body.sender}, $inc: {weight: 5}});
//     res.redirect("/list");
// })
app.get("*", function(req, res){
    res.sendFile(path.join(__dirname, "/views/error.html"))
});



