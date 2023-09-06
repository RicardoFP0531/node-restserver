const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, tieneRole } = require('../middlewares');
const { crearCategoria, obtenerCategorias, obtenerCategoriaId, actualizarCategoria, categoriaDelete } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');


const router = Router();

//obtener todas las categorias, paginado, utilizando populate de mongoose - PUBLICO
router.get('/', obtenerCategorias);

//obtener una categoria por id - PUBLICO
router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeCategoriaPorId),
    validarCampos
], obtenerCategoriaId );

//crear una nueva categoria - PRIVADO - CUALQUIER PERSONA CON UN TOKEN VALIDO
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria );

//actualizar mediante id - PRIVADO - CUALQUIERA CON TOKEN VALIDO
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom( existeCategoriaPorId),
    validarCampos
], actualizarCategoria );

//borrar una categoria - ADMINISTRADOR
router.delete('/:id', [
    validarJWT,
    tieneRole('VENTAS_ROLE', 'ADMIN_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom( existeCategoriaPorId),
    validarCampos
], categoriaDelete );







module.exports = router;