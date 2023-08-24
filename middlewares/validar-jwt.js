const { response, request } = require('express');
const jwt = require('jsonwebtoken');

//parte de la tarea de leccion 153, trayendo el modelo de usuario
const Usuario = require('../models/usuario');




const validarJWT = async (req = request, res = response, next) => {
    //obtener el jwt desde los headers
    const token = req.header('x-token');

    if(!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        });
    }

    try {

        //llamar el jwt para verificar 
        //al mismo tiempo estamos extrayendo el uid del usuario 
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);


        //leer el usuario que corresponde el uid, como viene de la BD usamos asyn - await 
        const usuario =  await Usuario.findById(uid);

        //validacion si el usuario no existe en la base de datos
        if(!usuario) {
            return res.status(401).json({
                msg: 'TOKEN no valido - Usuario no existe en DB'
            })
        }

        //verifica si el uid tiene estado en true
        if(!usuario.estado) {
            return res.status(401).json({
                msg: 'TOKEN no valido - usuario con estado en: FALSE'
            })
        }
        
        req.usuario = usuario;
        next();


    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg: 'Token no valido'
        })
    }


   
}

module.exports = {
    validarJWT
}