const { Router } = require('express');
const { check } = require('express-validator');


const { login, googleSignIn } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contrasena es obligatoria y debe contener minimo 6 caracteres').isLength({min: 6}),
    validarCampos
], login);

router.post('/google', [
    check('id_token', 'id_token de google es necesario para continuar').not().isEmpty(),
    validarCampos
], googleSignIn);


module.exports = router;