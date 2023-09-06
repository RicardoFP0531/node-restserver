const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { buscar } = require('../controllers/buscar');

const router = Router();

router.get('/:coleccion/:termino', [
    
], buscar);

module.exports = router;