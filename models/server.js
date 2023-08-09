const express = require('express');
const cors = require('cors');


class Server {

    constructor () {
        this.app = express();
        this.port = process.env.PORT;
        //end point de las rutas de los usuarios
        this.usuariosPath = '/api/usuarios';

        //llamando el metodo de los Middlewares 
        this.middlewares();

        //llamando el metodo de las Rutas de mi aplicacion
        this.routes();
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