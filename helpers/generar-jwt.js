const jwt = require('jsonwebtoken');

const generarJWT = ( uid = '' ) => {

    return new Promise((resolve, reject) => {

        const payload = { uid };

        //instruccion para generar el json web token
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '24h'
        }, (err , token) => {

            if (err) {
                console.log(err);
                reject('no se pudo generar el JWT')
            } else {
                resolve(token);
            }
        } )
        
    })

}


module.exports = {
    generarJWT
}


