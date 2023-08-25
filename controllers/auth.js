const { response } = require("express");
const bcryptjs = require("bcryptjs");
//trayendo el modelo de usuario
const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");


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

//CONTROLADOR DE LOGIN CON GOOGLE
const googleSignIn = async( req, res = response ) => {

    const {id_token} = req.body;

    try {

        const { nombre, img, correo } = await googleVerify( id_token );

        //referencia para ver si el correo ya existe en la base de datos
        let usuario = await Usuario.findOne( { correo });

        if(!usuario) { 
            //si no existe tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                rol: 'GOOGLE_ROLE',
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();

        }

        //si el usuario esta en la BD 
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Usuario bloqueado - verifique con el administrador'
            });
        }

        //generar el JWT 
        const token = await generarJWT( usuario.id );


         res.json({
            usuario,
            token

    })
  //manejando una exepcion en caso de que el codigo de arriba genere error
    } catch (error) {
        console.log(error)
        res.status(400).json({
            ok: false,
            msg: `El token no se pudo verificar`
        })
    }

}


module.exports = {
    login,
    googleSignIn
}