const { response } = require("express");
const { Categoria } = require("../models");



const crearCategoria = async (req, res = response, next) => {
    //extraer el nombre de la categoria que viene en el body y lo capitalizamos
    const nombre = req.body.nombre.toUpperCase();

    //preguntamos si existe una categoria con ese nombre
    const categoriaDb = await Categoria.findOne({nombre});
    //si existe mando un error 
    if( categoriaDb ) {
        return res.status(400).json({
            msg: `La categoria que intenta agregar: ${categoriaDb.nombre}, ya existe`
        });

    }

    //GENERAR LA DATA A GUARDAR el usuario tiene que tener un id de mongo
    const data = {
        nombre, 
        usuario: req.usuario._id, 
    }

    //lo crea, lo prepara pero aun no lo graba en la base de datos usando el modelo de categoria
    const categoria = await new Categoria(data);

    //guardar en DB
    await categoria.save();

    //una vez se graba podemos hacer la response o impresion de la data en la base de datos
    res.status(201).json(categoria);

}

//OBTENER TODAS LAS CATEGORIAS, PAGINADO, UTILIZANDO POPULATE DE MONGOOSE
const obtenerCategorias = async (req, res = response) => {
    

    const { limit = 10, desde = 0 } = req.query;
    const query = {estado: true}

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        .populate('usuario', 'nombre')
        .skip(Number(desde))
        .limit(Number(limit))
    ]);
    

    res.json({
        total,
       categorias,
       
    });
}

//CONTROLADOR DE OBTENER UNA CATEGORIA POR ID - PUBLICO
const obtenerCategoriaId = async (req, res = response ) => {

    const {id} = req.params;

    const categoria = await Categoria.findByIdAndUpdate( id )
    .populate('usuario', 'nombre');

    res.json(categoria);

}

//ACTUALIZAR MEDIANTE ID - PRIVADO - CUALQUIERA CON TOKEN VALIDO
const actualizarCategoria = async (req, res = response) => {

    const { id } = req.params;

    const { estado, usuario, ...resto } = req.body;

    //grabar el nombre de la categoria en UPPERCASE del producto que esto actualizando
    resto.nombre = resto.nombre.toUpperCase();

    //establecer el usuario que hizo la ultima mod
    resto.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, resto, {new: true});

    res.json(categoria);

}



//BORRAR CATEGORIAS (CAMBIAR EL ESTADO DE TRUE A FALSE PARA QUE LA MUESTRE)
const categoriaDelete = async (req, res) => {
    //traemos el id que ocupamos de los parametros para identificar la categoria que queremos eliminar
    const {id} = req.params;


    //cambiando por status de la categoria para no eliminarlo por completo
    const categoriaEliminada = await Categoria.findByIdAndUpdate( id, {estado: false}, {new: true});

    res.json(categoriaEliminada);

}


module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoriaId,
    actualizarCategoria,
    categoriaDelete,
}