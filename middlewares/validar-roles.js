const { response } = require('express');



const esAdminRole = (req, res = response, next) => {

    if( !req.usuario ) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token primero'
        })
    }

    const {rol, nombre } = req.usuario;

    if ( rol !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            msg: `Su usuario: ${nombre}, no tiene el rol de administrador - no puede elimar otros usuarios`
        })
    }



    next();
}


const tieneRole = ( ...roles ) => {

    return (req, res = response, next) => {

        if( !req.usuario ) {
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin validar el token primero'
            })
        }

        if( !roles.includes( req.usuario.rol )) {
            return res.status(401).json({
                msg: `El servicio requiere alguno de estos roles: ${roles}`
            })
        }



        next();
    }
    

}


module.exports = {
    esAdminRole,
    tieneRole
}