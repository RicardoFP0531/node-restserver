const { response } = require("express");
const { Producto } = require("../models");



const crearProducto = async (req, res = response, next) => {
    //excluir el estado y usuario del producto y todo lo demas ira en el body
    const { estado, usuario, ...body } = req.body;

    //preguntamos si existe un producto con ese nombre
    const productoDb = await Producto.findOne({nombre: body.nombre});
    //si existe el producto mando un error 
    if( productoDb ) {
        return res.status(400).json({
            msg: `El producto que intenta agregar: ${productoDb.nombre}, ya existe`
        });

    }

    //GENERAR LA DATA A GUARDAR el usuario tiene que tener un id de mongo
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(), 
        usuario: req.usuario._id, 
    }

    //lo crea, lo prepara pero aun no lo graba en la base de datos usando el modelo de categoria
    const producto = await new Producto(data);

    //guardar en DB
    await producto.save();

    //una vez se graba podemos hacer la response o impresion de la data en la base de datos
    res.status(201).json(producto);

}

//OBTENER TODAS LAS CATEGORIAS, PAGINADO, UTILIZANDO POPULATE DE MONGOOSE
const obtenerProductos = async (req, res = response) => {
    

    const { limit = 10, desde = 0 } = req.query;
    const query = {estado: true}

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .populate('usuario', 'nombre')
        //se hace el populate de la categoria igual para saber de que categoria es
        .populate('categoria', 'nombre')
        .skip(Number(desde))
        .limit(Number(limit))
    ]);
    

    res.json({
        total,
       productos,
       
    });
}

//CONTROLADOR DE OBTENER UN PRODUCTO MEDIANTE SU ID - PUBLICO
const obtenerProductoId = async (req, res = response ) => {

    const {id} = req.params;

    const producto = await Producto.findByIdAndUpdate( id )
    .populate('usuario', 'nombre')
    .populate('categoria', 'nombre');

    res.json(producto);

}

//ACTUALIZAR MEDIANTE ID - PRIVADO - CUALQUIERA CON TOKEN VALIDO
const actualizarProducto = async (req, res = response) => {

    const { id } = req.params;

    const { estado, usuario, ...resto } = req.body;

    //grabar el nombre de la categoria en UPPERCASE del producto que esto actualizando
    if(resto.nombre) {
        resto.nombre = resto.nombre.toUpperCase();
    }
   
    //establecer el usuario que hizo la ultima mod
    resto.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, resto, {new: true});

    res.json(producto);

}



//BORRAR CATEGORIAS (CAMBIAR EL ESTADO DE TRUE A FALSE PARA QUE LA MUESTRE)
const productoDelete = async (req, res) => {
    //traemos el id que ocupamos de los parametros para identificar la categoria que queremos eliminar
    const {id} = req.params;


    //cambiando por status de la categoria para no eliminarlo por completo
    const productoEliminado = await Producto.findByIdAndUpdate( id, {estado: false}, {new: true});

    res.json(productoEliminado);

}


module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProductoId,
    actualizarProducto,
    productoDelete

}