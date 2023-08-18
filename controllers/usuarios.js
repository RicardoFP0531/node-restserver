const { response } = require('express');
const bcryptjs = require('bcryptjs');

//IMPORTACION DEL MODELO DE BASE DE DATOS USUARIO
//por que con la U mayuscula? por que esto me permite crear instancias del modelo
const Usuario = require('../models/usuario');



const usuariosGet = async (req, res = response) => {
    

    const { limit = 5, desde = 0 } = req.query;
    const query = {estado: true}

    // const usuarios = await Usuario.find(query)
    //     .skip(Number(desde))
    //     .limit(Number(limit));

    // //RETORNANDO EL TOTAL DE REGISTROS EN LA COLECCION
    // const total = await Usuario.countDocuments(query);

    //disparando 2 peticiones de manera simultanea usando Promise
       //desestructuracion de arreglos
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limit))
    ]);
    

    res.json({
        total,
       usuarios,
       
    });
}

const usuariosPut = async (req, res) => {

    const { id } = req.params;
    //extrayendo info que viene en la request y lo que yo no necesito que se grabe
    const { _id, password, google, correo, ...resto } = req.body;

    //validacion previa de ruta

    //todo Validar contra la BD
    if(password) {
        //volver a encriptar la contra
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuarioDB = await Usuario.findByIdAndUpdate( id, resto )


    res.json(usuarioDB);
}

const usuariosPost = async (req, res) => {

    //validacion del check puesto en las rutas para mostrar en consola
    //ahora se maneja por un middleware personalizado
    //se invoca en routes usuarios validarCampos


    //desestructuracion para pedir lo que necesito del body
    const { nombre, password, correo, rol } = req.body;
    //por eso lleva u mayuscula para crear la nueva instancia del usuario
    const usuario = new Usuario({ nombre, password, correo, rol });

    //verificar si el correo existe
    //se cambio por el de la tarea del video 133 validar que el correo exista

    //Encriptar la contrasena
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);


    //para grabar esa info en la BD hay que decirle a mongoose que lo haga con el sig codigo
    await usuario.save();


    res.json({
        //trayendo a la consola la info des estructurada
        usuario
    });
}

const usuariosDelete = async (req, res) => {
    //traer lo que ocupo de los parametros
    const {id} = req.params;

    //fisicamente lo borramos
    //const usuario = await Usuario.findByIdAndDelete( id );

    //cambiando por status de usuario para no eliminarlo por completo
    const usuario = await Usuario.findByIdAndUpdate( id, {estado: false});

    res.json(usuario);
}


module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete
}