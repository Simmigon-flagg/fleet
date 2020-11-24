require('dotenv').config()
const express = require("express");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

const app = express();
const morgan = require('morgan');
app.use(morgan('tiny'));
app.use(express.json());
// Set up remote database
require("./config/mongooseconnection");
const Fleet = require('./models/Fleets')

const PORT = process.env.PORT || 5000;

app.get("/api/v1/fleet", checkAuthToken, async (request, response) => {
  const cars = await Fleet.find({})
  console.log(cars)
  return response.json(cars);
});

app.get("/api/v1/fleet/data", (request, response) => {

  return response.json(fleet);
});

app.post("/api/v1/fleet", (request, response) => {
  request.body.charge = Math.floor(Math.random() * 101).toString();
  const car = request.body;
 
  const newCar = new Fleet(car)
  newCar.save((error) =>{
    if(error){
      console.log(error)
      console.log("Not Saved")
    }else{
      
      console.log("Saved")
    }
  })
  return response.json(newCar);
});

app.get("/api/v1/car/:id", (request, response) => {
  const id = request.params.id;
  console.log(id);
  let car = {};
  _.find(fleet, function (fleet) {
    if (fleet.carId === id) {
      car = fleet;
    }
  });

  if (!_.isEmpty(car)) {
    return response.status(200).json( car );
  } else {
    return response.status(404).json({ message: "Not Found" });
  }
});


function checkAuthToken(request, response, next){

  const authHeader = request.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1];

  if(token == null) return response.status(401).send()

    jwt.verify(token, process.env.TOKEN_SECRET, (error, user)=> {
    
      if(error) return response.status(403).send()
        request.user = user;
        next()
    })
  }

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
