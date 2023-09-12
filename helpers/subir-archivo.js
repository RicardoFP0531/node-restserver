const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = ( files, extencionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '' ) => {

    return new Promise(( resolve, reject ) => {

        const { archivo } = files;

        //para la validacion de nombre de archivos genera un arreglo del archivo separado
        const nombreCortado = archivo.name.split('.');
        //tomar la ultima posicion para obtener la extension del archivo
        const extension = nombreCortado[nombreCortado.length - 1];

        //validar contra las extensiones que yo voy a permitir
        if(!extencionesValidas.includes( extension )) {
            return reject( `La extension: ${extension} no esta permitida, las extensiones permitidas son: ${extencionesValidas}` );
        }

        //constante para cambiar temporalmente el nombre del archivo subido
        const nombreTemporal = uuidv4() + '.' + extension;

        const uploadPath = path.join( __dirname, '../uploads/', carpeta, nombreTemporal );

        archivo.mv(uploadPath, (err) => {
            if (err) {
                reject( err );
            }

            resolve(nombreTemporal);
        });

    } )


}


module.exports = {
    subirArchivo
}