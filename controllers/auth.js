const { response } = require("express");
const bcryptjs = require("bcryptjs");
//trayendo el modelo de usuario
const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");


const login =  async (req, res = response) => {

    const { correo, password } = req.body;

    try {
        //verificar si el email existe
        const usuario = await Usuario.findOne({correo})

        if( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario / Password incorrect - correo'
            });

        }
        //si el usuario esta activo
        if( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario / Password incorrect - estado: false '
            });

        }
        //verificar la contrasena
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password incorrect - password verify'
            });
        }

        //generar el JWT
        //ya tiene el return la promesa del helpers generar-jwt, por eso podemos usar el await
        const token = await generarJWT( usuario.id );



        
    res.json({
        usuario,
        token
      
       
    });


    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Error hable con el admin'
        })
        
    }

}


module.exports = {
    login
}