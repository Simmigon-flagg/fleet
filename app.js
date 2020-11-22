require('dotenv').config()
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

const app = express();
app.use(express.json());

const users = [];
const fleet = [
  {
    carId: uuidv4(),
    latitude: 33.753746,
    longitude: -84.38633,
    location: "Atlanta, GA",
    charge: Math.floor(Math.random() * 101),
  },
  {
    carId: uuidv4(),
    latitude: 34.155834,
    longitude: -119.202789,
    location: "Port Hueneme",
    charge: Math.floor(Math.random() * 101),
  },
  {
    carId: uuidv4(),
    latitude: 42.933334,
    longitude: -76.566666,
    location: "Auburn, NY",
    charge: Math.floor(Math.random() * 101),
  },
  {
    carId: uuidv4(),
    latitude: 42.095554,
    longitude: -79.238609,
    location: "Jamestown, NY",
    charge: Math.floor(Math.random() * 101),
  },
  {
    carId: uuidv4(),
    latitude: 38.846668,
    longitude: -91.948059,
    location: "Fulton, MO",
    charge: Math.floor(Math.random() * 101),
  },
  {
    carId: uuidv4(),
    latitude: 41.392502,
    longitude: -81.534447,
    location: "Bedford, OH",
    charge: Math.floor(Math.random() * 101),
  },
  {
    carId: uuidv4(),
    latitude: 27.192223,
    longitude: -80.243057,
    location: "Stuart, FL",
    charge: Math.floor(Math.random() * 101),
  },
  {
    carId: uuidv4(),
    latitude: 31.442778,
    longitude: -100.450279,
    location: "San Angelo",
    charge: Math.floor(Math.random() * 101),
  },
  {
    carId: uuidv4(),
    latitude: 40.560001,
    longitude: -74.290001,
    location: "Woodbridge, NJ",
    charge: Math.floor(Math.random() * 101),
  },
  {
    carId: uuidv4(),
    latitude: 33.193611,
    longitude: -117.241112,
    location: "Vista, CA",
    charge: Math.floor(Math.random() * 101),
  },
  {
    carId: uuidv4(),
    latitude: 41.676388,
    longitude: -86.250275,
    location: "South Bend, IN",
    charge: Math.floor(Math.random() * 101),
  },
];

const PORT = 5000;
app.get("/", (request, response) => {
  return response.json({ message: "Welcome to GM Fleets" });
});

app.get("/users", (request, response) => {
  return response.json(users);
});

app.post("/users", async (request, response) => {
  try {
    const hashedPassword = await bcrypt.hash(request.body.password, 10);

    const user = {
      id: uuidv4(),
      name: request.body.name,
      password: hashedPassword,
      isAdmin: request.body.isAdmin,
    };

    users.push(user);
    return response.sendStatus(201);
  } catch {
    return response.sendStatus(500);
  }
});

app.post("/users/login", async (request, response) => {
  //Search for user by ID
  //This line is not returning the users name
  const foundUser = users.find((user) => user.name == request.body.name);

  
  if (foundUser != null) {
    console.log(`Found: ${foundUser}`);
    try {
      if (await bcrypt.compare(request.body.password, foundUser.password)) {
        const { id, name, isAdmin } = foundUser;
        const user = {
          id, 
          name,
          isAdmin
        }
       
        const accessToken = jwt.sign(user, process.env.TOKEN_SECRET)

        return response.status(200).json( { accessToken });
      } else {
        return response.status(401).json({ message: "Invalid Username/Password" });
      }
    } catch {
      return response.status(500).json({ message: "Server Error" });
    }
  } else {
    console.log(`This is is not found: ${foundUser}`);
    
  }
});

app.get("/fleet", checkAuthToken, (request, response) => {
  
  return response.json(fleet);
});

app.get("/car/:id", (request, response) => {
  const id = request.params.id;
  let car = {};
  _.find(fleet, function (fleet) {
    if (fleet.carId === id) {
      car = fleet;
    }
  });

  if (!_.isEmpty(car)) {
    return response.status(200).json({ car });
  } else {
    return response.status(404).json({ message: "Not Found" });
  }
});


function checkAuthToken(request, response, next){
  console.log();
  const authHeader = request.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1];
  if(token != null){
    jwt.verify(token, process.env.TOKEN_SECRET, (error, user)=> {
      if(!error){
        request.user = user;
        next()
        
      }else{
        
        return response.status(403)
      }
    })
  }else{
    return response.status(401)
  }
}
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
