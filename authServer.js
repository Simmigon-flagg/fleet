require('dotenv').config()
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

const app = express();
app.use(express.json());

//Set up remote database
let users = [];

//Set up remote redis database
let refreshTokens = [];


const PORT = 4000;
app.get("/", (request, response) => {
  return response.json({ message: "Welcome to GM Fleets" });
});

app.get("/users", (request, response) => {
  return response.json(users);
});

app.get("/refreshTokens", (request, response) => {
  return response.json(refreshTokens);
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
       
        const accessToken = createAccessToken(user)
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN);
        // Add to redis database
        refreshTokens.push(refreshToken);

        return response.status(200).json( { accessToken, refreshToken});
      } else {
        return response.status(401).json({ message: "Invalid Username/Password" });
      }
    } catch {
      return response.status(500).json({ message: "Server Error" });
    }
  } else {
    return response.status(401).json({ message: "Invalid Username/Password" });
  }
});

app.delete('/users/logout', (request, response) => {
  // Search the database for refresh-token then delete that token.
  const index = refreshTokens.indexOf(request.body.refreshToken)
  if(-1 < index){
    refreshTokens.pop(index)
    response.status(204).send()
  }

})
app.post('/refresh-token',(request, response) => {
  const refreshToken = request.body.refreshToken;
  if(refreshToken == null) return response.send(401);
  // Search Database for token 
  if(!refreshTokens.includes(refreshToken)) return response.send(403)

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (error, user) =>{
    if(error) return response.send(403)
    const {id, name, isAdmin } = user;
    const userData = {
      id, 
      name,
      isAdmin

    }
    const accessToken = createAccessToken(userData);
    return response.json({ accessToken })

  })
  console.log(refreshToken);
})
function createAccessToken(user){
  return  jwt.sign(user, process.env.TOKEN_SECRET, {expiresIn: '50s'})
  
}


app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
