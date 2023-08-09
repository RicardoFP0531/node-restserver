const { response } = require('express');

const usuariosGet = (req, res = response) => {
    //se puede des estructura los queryParams para darle esa flexibilidad 
    const queryParams = req.query;

    res.json({
        msg: 'get API - controller',
        queryParams
    });
}

const usuariosPut = (req, res) => {

    const {id} = req.params;

    res.status(201).json({
        msg: 'put API - controller',
        id
    });
}

const usuariosPost = (req, res) => {
    //desestructuracion para pedir lo que necesito del body
    const {nombre, id} =  req.body;

    res.status(201).json({
        msg: 'post API - controller',
        //trayendo a la consola la info des estructurada
        nombre, id
    });
}

const usuariosDelete = (req, res) => {
    res.json({
        msg: 'delete API - controller'
    });
} 


module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete
}