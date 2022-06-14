const {connect} = require('mongoose');


const dbConnection = async() =>{

    try {
        await connect(process.env.DB_CNN);
        console.log('Conectado a la BD');
        
    } catch (error) {
        console.log(error);
        throw new Error('Error al conectar a la BD')
    }
}

module.exports = {
    dbConnection
}