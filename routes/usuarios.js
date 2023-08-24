const { Router } = require('express');
const { check } = require('express-validator');

// const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');
const {validarCampos, validarJWT, tieneRole} = require('../middlewares');

const { rolValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete } = require('../controllers/usuarios');


const router = Router();

router.get('/', usuariosGet);

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    //seria obligatorio el rol
    check('rol').custom( rolValido ),
    validarCampos
], usuariosPut);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contrasena es obligatoria y debe contener minimo 6 caracteres').isLength({min: 6}),
    check('correo', 'Correo no valido').isEmail(),
    check('correo').custom(emailExiste),
    // check('rol', 'No es un rol permitido').isIn(['ADMIN_ROL', 'USER_ROL']),
    check('rol').custom( rolValido ),
    validarCampos
], usuariosPost);

router.delete('/:id',[
//mandamos llamar el validarJWT que es nuestro middleware personalizado
//antes que los demas para que valide si tiene un JWT valido y si es asi que continue
    validarJWT,
    //esAdminRole,
    tieneRole('VENTAS_ROLE', 'ADMIN_ROLE'),
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete);




module.exports = router;