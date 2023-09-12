const path = require('path');
const fs = require('fs');
//usando cloudinary declarando la constante
const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );

const { response } = require("express");
const { subirArchivo } = require("../helpers/");
const { Usuario, Producto } = require('../models');




const cargarArchivo = async (req, res = response) => {

    try {
        //path para subir imagenes
        //funcionalidad nueva para agregar archivos txt y md
        //const nombre = await subirArchivo(req.files, ['txt', 'md'], 'textos' );
        const nombre = await subirArchivo(req.files, undefined, 'imgs' );

        res.json({ nombre })
        
    } catch (msg) {

        res.status(400).json({msg}) 
    }
  
}


//nuevo controlador de ruta para actualizar imagenes de usuarios o productos
const actualizarImagen = async (req, res = response) => {

    //traemos la info que solicitamos de la ruta coleccion y el id
    const { id, coleccion } = req.params;

    //declarando variable y se establece su valor de manera condicional
    let model;

    switch ( coleccion ) {
        case 'usuarios':
            model = await Usuario.findById(id);
            if ( !model ) {
                return res.status(400).json({
                    msg: `No existe usuario con el id: ${id}`
                });
            } 

            break;

        case 'productos':
            model = await Producto.findById(id);
            if ( !model ) {
                return res.status(400).json({
                    msg: `No existe producto con el id: ${id}`
                })
            } 
        
            break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' });
    }

    //Limpiar las imagenes previas
    if ( model.img )  {
        //borrar la imagen del servidor
        const pathImg = path.join( __dirname, '../uploads', coleccion, model.img );
        if( fs.existsSync( pathImg )) {
            //para borrar unlink mandando la ruta de la imagen
            fs.unlinkSync(pathImg)
            
        }
    }
    //creando las carpetas respectivas para guardar la imagen ya sea de usaurio o productos 
    const nombre = await subirArchivo(req.files, undefined, coleccion );
    model.img = nombre;
    

    await model.save();

    res.json( model );

}

//actualizar imagen con cludinary
const actualizarImagenCloudinary = async (req, res = response) => {

    //traemos la info que solicitamos de la ruta coleccion y el id
    const { id, coleccion } = req.params;

    //declarando variable y se establece su valor de manera condicional
    let model;

    switch ( coleccion ) {
        case 'usuarios':
            model = await Usuario.findById(id);
            if ( !model ) {
                return res.status(400).json({
                    msg: `No existe usuario con el id: ${id}`
                });
            } 

            break;

        case 'productos':
            model = await Producto.findById(id);
            if ( !model ) {
                return res.status(400).json({
                    msg: `No existe producto con el id: ${id}`
                })
            } 
        
            break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' });
    }

    //Limpiar las imagenes previas
    if ( model.img )  {
        const rutaArr = model.img.split('/');
        const nombre  = rutaArr[ rutaArr.length - 1 ];

        const [ public_id ] = nombre.split('.')

        cloudinary.uploader.destroy( public_id );


    }
    //des estructurando el path temporal de la imagen que se subira a cloudinary
    const { tempFilePath } = req.files.archivo;

    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

    model.img = secure_url;
    

    await model.save();

    res.json( model );

}

/////////////////////////////////////////////////////////////////


const mostrarImagen = async ( req, res = response ) => {

    //traemos la info que solicitamos de la ruta coleccion y el id
    const { id, coleccion } = req.params;

    //declarando variable y se establece su valor de manera condicional
    let model;

    switch ( coleccion ) {
        case 'usuarios':
            model = await Usuario.findById(id);
            if ( !model ) {
                return res.status(400).json({
                    msg: `No existe usuario con el id: ${id}`
                });
            } 

            break;

        case 'productos':
            model = await Producto.findById(id);
            if ( !model ) {
                return res.status(400).json({
                    msg: `No existe producto con el id: ${id}`
                })
            } 
        
            break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' });
    }

    //Limpiar las imagenes previas
    if ( model.img )  {
        //borrar la imagen del servidor
        const pathImg = path.join( __dirname, '../uploads', coleccion, model.img );
        if( fs.existsSync( pathImg )) {
            //responder la imagen 
            return res.sendFile(pathImg)
            
        }
    }

    const pathImagen = path.join( __dirname, '../assets/no-image.jpg' );
    res.sendFile(pathImagen);
        

}



module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}
