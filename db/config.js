const mongoose = require('mongoose');


const dbConnection = async() => {

    //es buena practica el try y el catch por si puede fallar
    try {
        
        //conexion a mongoose
        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true,
            // useFindAndModify: false
        });

        console.log('Base de datos online');


    } catch (error) {
        console.log(error)
        throw new Error('Error al inicializar la base de datos');
        
    }

}


module.exports = {
    dbConnection
}
