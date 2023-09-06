
const Role = require('../models/role');
const { Categoria, Usuario, Producto } = require('../models');

const rolValido = async(rol = '') => {
    const existeRol = await Role.findOne({rol});
    //si no existe significa que es una validacion que tendria que chocar y 
    //se maneja con un errror personalizado atrapado en el custom
    if(!existeRol) {
        throw new Error(`El rol ${rol} no esta registrado en la BD`);
    }

}

//tarea video 133 validar si existe el email
//si uso el modelo del usuario hay que importarlo
const emailExiste = async( correo = '' ) => {
    const existeCorreo = await Usuario.findOne({ correo });
    if (existeCorreo) {
        throw new Error(`El correo que ingreso: ${correo}, ya esta registrado`); 
    }
}

const existeUsuarioPorId = async( id ) => {
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id que ingreso: ${id}, no existe`); 
    }
}

//validador del id de la categoria
const existeCategoriaPorId = async( id ) => {
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria) {
        throw new Error(`El id de la categoria que ingreso: ${id}, no existe`); 
    }
}

//validador del id del producto
const existeProductoPorId = async( id ) => {
    const existeProducto = await Producto.findById(id);
    if (!existeProducto) {
        throw new Error(`El id del producto que ingreso: ${id}, no existe`); 
    }
}




module.exports = {
    rolValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId
}