const { response } = require("express");
const { Usuario, Categoria, Producto } = require("../models");
const { ObjectId } = require('mongoose').Types;

//aqui se colocan todas las busquedas posibles validas que se han creado, si se quiere anadir nueva se tiene que agregar igual
const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async ( termino = '', res = response ) => {

    //validando si el termino es un mongoID
    const esMongoID = ObjectId.isValid(termino); //si es id de mongo devuelve TRUE si no FALSE
    if( esMongoID ) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        })
    }

    //creando la expresion regular que sea insensibles a las mayusculas y minusculas 
    //viene por default de javascript 
    const regex = new RegExp( termino, 'i')

    //buscar por el termino
    const usuarios = await Usuario.find({ 
        //usando $or que es propiedad de mongo para elegir cual de las respuestas dar
        $or: [{ nombre : regex }, { correo: regex }],
        $and: [{ estado : true }]
     });

    return res.json({
        results: usuarios
    })

}


const buscarCategorias = async ( termino = '', res = response ) => {

    //validando si el termino es un mongoID
    const esMongoID = ObjectId.isValid(termino); //si es id de mongo devuelve TRUE si no FALSE
    if( esMongoID ) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        })
    }

    //creando la expresion regular que sea insensibles a las mayusculas y minusculas 
    //viene por default de javascript 
    const regex = new RegExp( termino, 'i')

    //buscar por el termino
    const categoria = await Categoria.find({ nombre : regex, estado : true });

    return res.json({
        results: categoria
    })

}

const buscarProductos = async ( termino = '', res = response ) => {

    //validando si el termino es un mongoID
    const esMongoID = ObjectId.isValid(termino); //si es id de mongo devuelve TRUE si no FALSE
    if( esMongoID ) {
        const producto = await Producto.findById(termino)
                               .populate('categoria', 'nombre');
        return res.json({
            results: (producto) ? [producto] : []
        })
    }

    //creando la expresion regular que sea insensibles a las mayusculas y minusculas 
    //viene por default de javascript 
    const regex = new RegExp( termino, 'i')

    //buscar por el termino
    const producto = await Producto.find({ nombre : regex, estado : true })
                           .populate('categoria', 'nombre');

    return res.json({
        results: producto
    })

}



const buscar = (req, res = response ) => {

    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }
    
    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res)

        break;

        case 'categorias':
            buscarCategorias(termino, res)

        break;

        case 'productos':
            buscarProductos(termino, res)

        break;

        default:
            res.status(500).json({
                msg: 'Se me olvido hacer esta busqueda'
            })
    }

}


module.exports = {
    buscar
}