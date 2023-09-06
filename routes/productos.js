const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, tieneRole } = require('../middlewares');
const { crearProducto, obtenerProductos, obtenerProductoId, actualizarProducto, productoDelete } = require('../controllers/productos');
const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');

const router = Router();

//obtener todas las categorias, paginado, utilizando populate de mongoose - PUBLICO
router.get('/', obtenerProductos);

//obtener una producto por id - PUBLICO
router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeProductoPorId),
    validarCampos
], obtenerProductoId );

//crear una nuevo producto - PRIVADO - CUALQUIER PERSONA CON UN TOKEN VALIDO
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id valido de Mongo').isMongoId(),
    //tiene que existir la categoria si no tira error
    check('categoria').custom( existeCategoriaPorId),
    validarCampos
], crearProducto );

//actualizar producto mediante id - PRIVADO - CUALQUIERA CON TOKEN VALIDO
router.put('/:id', [
    validarJWT,
    check('categoria', 'No es un id valido de Mongo').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], actualizarProducto );

//borrar una categoria - ADMINISTRADOR
router.delete('/:id', [
    validarJWT,
    tieneRole('VENTAS_ROLE', 'ADMIN_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], productoDelete );







module.exports = router;