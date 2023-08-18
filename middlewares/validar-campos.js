const { validationResult } = require('express-validator');

const validarCampos = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }

    //si llega a este punto sigue con el siguiente middleware
    //y si ya no hay middleware entonces seria al controlador.
    next();

}


module.exports = {

    validarCampos
}
