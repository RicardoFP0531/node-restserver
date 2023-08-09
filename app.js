//importaciones de node 
require('dotenv').config();

//codigo que yo hago
const Server = require('./models/server');



const server = new Server();


server.listen();