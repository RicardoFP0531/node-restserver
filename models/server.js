const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../db/config');


class Server {

    constructor () {
        this.app = express();
        this.port = process.env.PORT;
        //end point de las rutas de los usuarios
        this.usuariosPath = '/api/usuarios';

        //conectar a base de datos
        this.conectarDB();


        //llamando el metodo de los Middlewares 
        this.middlewares();

        //llamando el metodo de las Rutas de mi aplicacion
        this.routes();
    }

    //metodo para la base de datos
    async conectarDB() {
        await dbConnection();
    }

    //metodo de los middlewares
    middlewares() {

        //CORS
        this.app.use(cors());


        //lectura y parseo del body (cualquier info del post put o delete)
        this.app.use(express.json());


        //directorio publico
        this.app.use(express.static('public'));

    }

    //creando metodos para las rutas
    routes () {

        this.app.use( this.usuariosPath, require('../routes/usuarios') )

    }

    listen () {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo desde el puerto ${this.port}`);
        });
    }


}

module.exports = Server;