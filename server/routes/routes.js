const express = require("express");
const bcrypt = require('bcrypt')
const routes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

// Fetches and returns Products


//Fetches and returns Comments


//Fetches and returns users

//Fetches and returns purchases
routes.route("/Kleiderschrank/Kleidung").get(function (req, res) {
    let db_connect = dbo.getDb();
    db_connect
        .collection("Kleidung")
        .find({})
        .toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

//Fetches and returns specific user based on ID
routes.route("/Kleiderschrank/:id").get(function (req, res) {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId( req.params.id )};
    db_connect
        .collection("Kleidung")
        .findOne(myquery, function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

//Logs product to Db
routes.route("/Kleiderschrank/add").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myobj = {
      Name: req.body.Name,
      Description: req.body.Description,
      Price: req.body.Price,
      Availability: req.body.Availability,
      img: req.body.img
  };
  db_connect.collection("Kleidung").insertOne(myobj, function (err, res) {
      console.log(myobj._id)
      if (err) throw err;
      response.json(res);
  });
});

//Checks if User with passed credentials exists, returns found Documents with given credentials
routes.route("/Kleiderschrank/login").post(function (req, res) {
    let db_connect = dbo.getDb();
    console.log(req.body.email.toLowerCase())
    db_connect
        .collection("users")
        .find({"email": req.body.email.toLowerCase()})
        .toArray(function (err, result) {
            if(result.length === 0) {
                console.log(result)
                console.log('There is no User with that Email')
                res.json(false)
            }else if(result[0].password !== req.body.password){
                console.log('Password is incorrect')
                res.json(false)
            }else{
                res.json(result[0])
            }
        });

});


//Update Product with passed Data
routes.route("/updateProduct/:id").post(function (req, response) {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId( req.params.id )};
    let newvalues = {
        $set: {
            Name: req.body.Name,
            Description: req.body.Description,
            Availability: req.body.Availability,
            Price: req.body.Price,
            img: req.body.img,
        },
    };
    db_connect
        .collection("products")
        .updateOne(myquery, newvalues, function (err, res) {
            if (err) throw err;
            response.json(res);
        });
});


//Delete Product with passed ID
routes.route("/delProduct/:id").delete((req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id)};
  db_connect.collection("products").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 Product deleted");
    response.json(obj);
  });
});

//Delete User with passed ID
routes.route("/delUser/:id").delete((req, response) => {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(req.params.id)};
    db_connect.collection("users").deleteOne(myquery, function (err, obj) {
        if (err) throw err;
        console.log("1 user deleted");
        response.json(obj);
    });
});


module.exports = routes;
