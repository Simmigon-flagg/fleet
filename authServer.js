require("dotenv").config();
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
//Set up remote database
require("./config/mongooseconnection");
const Users = require("./models/Users");


const app = express();
app.use(express.json());

//Set up remote redis database
let refreshTokens = [];

const PORT = process.env.PORT || 4000;
app.get("/api/v1", async (request, response) => {
  const users = await Users.find({});
  console.log(users);
  return response.json({ message: "Welcome to GM Fleets" });
});

app.get("/api/v1/user/all", (request, response) => {
  return response.json(users);
});

app.post("/api/v1/user", async (request, response) => {
  const searchByUserName = { name: request.body.name };
  const foundUser = await Users.find(searchByUserName);
  if (foundUser >= 0) {
    console.log("Not Found");
    try {
      const hashedPassword = await bcrypt.hash(request.body.password, 10);
      const user = {
        id: uuidv4(),
        name: request.body.name,
        password: hashedPassword,
        isAdmin: request.body.isAdmin,
      };
      console.log(user);
      const newUser = new Users(user);
      newUser.save((error) => {
        if (!error) {
          return response.sendStatus(201);
        } else {
          // This is a database error or schema error
          return response.sendStatus(500);
        }
      });
    } catch {
      return response.sendStatus(500);
    }
  } else {
    return response.sendStatus(404).json({ message: "That User Exist" });
  }
});

app.post("/api/v1/user/login", async (request, response) => {
  //Search for user by ID
  //This line is not returning the users name
  const search = { name: request.body.name };
  const foundUser = await Users.find(search);
  let user = {};
  let accessToken ="";
  let refreshToken = "";
  if (foundUser.length > 0) {
    const {id , name, isAdmin} = foundUser[0];
    try {
      if (await bcrypt.compare(request.body.password, foundUser[0].password)) {
          
         user = {
          id: foundUser[0]._id,
          name: foundUser[0].name,
          isAdmin: foundUser[0].isAdmin,
        };
 

        accessToken = createAccessToken(user);
        refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN);
        // Add to redis database
        const id = user.id;
        const token = refreshToken
     
        const temp = {}
        temp[String(id)] = token;
  
        console.log("=====================================")
        
        const found = false;
        for(let i = 0; i < refreshTokens.length; i++){
          const keys =  Object.keys(refreshTokens[i])
          for(let j = 0; j < keys.length; j++){
            console.log(keys[j] + " == "+ id)
            if(keys[j] == id){
              console.log("Found at " + j)
              console.log("Found at " + i + " " + refreshTokens[i][String(id)])
              
              refreshTokens[i][id] = token;
              found = true;
            }
          }
        }
       if(!found){
        refreshTokens.push(temp)
       }
        console.log("=====================================")
        

        
        console.log(name)
        return response.status(200).json({ accessToken, refreshToken, name , id, isAdmin });
      } else {
        return response
        .status(401)
        .json({ message: "Invalid Username/Password" });
      }
    } catch {
      return response.status(200).json({ accessToken, refreshToken,  name , id, isAdmin });
      
    }
  } else {
    console.log("Not : Found");
    return response.status(401).json({ message: "Invalid Username/Password" });
  }
});

app.delete("/api/v1/user/logout", (request, response) => {
  // Search the database for refresh-token then delete that token.
  const index = refreshTokens.indexOf(request.body.refreshToken);
  if (-1 < index) {
    refreshTokens.pop(index);
    response.status(204).send();
  }
});

app.get("/api/v1/user/refreshTokens", (request, response) => {
  return response.json(refreshTokens);
});
app.post("/api/v1/user/refresh-token", (request, response) => {
  const refreshToken = request.body.refreshToken;
  if (refreshToken == null) return response.send(401);
  // Search Database for token
  if (!refreshTokens.includes(refreshToken)) return response.send(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (error, user) => {
    if (error) return response.send(403);
    const { id, name, isAdmin } = user;
    const userData = {
      id,
      name,
      isAdmin,
    };
    const accessToken = createAccessToken(userData);
    return response.json({ accessToken });
  });
});
function createAccessToken(user) {
  return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: "1d" });
}

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
