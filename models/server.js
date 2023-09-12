const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../db/config');
const fileUpload = require('express-fileupload');


class Server {

    constructor () {
        this.app = express();
        this.port = process.env.PORT;
        //SECCION 12 tip para las rutas 
        this.paths = {
            usuarios:   '/api/usuarios',
            auth:       '/api/auth',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            buscar:     '/api/buscar',
            uploads:    '/api/uploads'
        }

        //ANTIGUO CODIGO PARA LLAMAR LAS RUTAS EL CODIGO DE ARRIBA MEJORA ESA FUNCION
        // //end point de las rutas de los usuarios
        // this.usuariosPath = '/api/usuarios';
        // //nueva RUTA del authentication SECCION 1O CURSO
        // this.authPath     = '/api/auth';

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

        //SECCION 13 MIDDLEWARE PARA LA CARGA DE ARCHIVOS EXPRESS-FILEUPLOAD
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));

    }

    //creando metodos para las rutas
    routes () {

        this.app.use( this.paths.usuarios,  require('../routes/usuarios') );
        
        //NUEVA RUTA SECCION 10 DEL CURSO AUTENTICACION DE USUARIOS
        this.app.use(this.paths.auth,       require('../routes/auth'));
        
        //NUEVA RUTA SECCION 12 DEL CURSO CATEGORIAS
        this.app.use(this.paths.categorias, require('../routes/categorias'));

        //NUEVA RUTA SECCION 12 DEL CURSO PRODUCTOS
        this.app.use(this.paths.productos,  require('../routes/productos'));

        //NUEVA RUTA BUSCAR 
        this.app.use(this.paths.buscar,     require('../routes/buscar'));

        //NUEVA RUTA CARGAR ARCHIVOS  
        this.app.use(this.paths.uploads,     require('../routes/uploads'));
        

    }

    listen () {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo desde el puerto ${this.port}`);
        });
    }


}

module.exports = Server;