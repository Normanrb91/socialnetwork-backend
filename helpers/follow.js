const Seguimiento = require("../models/Seguimiento");


const seguidorYseguido = async (idUsuario, miId) => {

    const siguiendo = await Seguimiento.findOne({'user': miId, 'followed': idUsuario}).select({
        '_id': 0,
        'createdAt': 0,
        'updatedAt': 0
    });
    const seguido = await Seguimiento.findOne({'user': idUsuario, 'followed': miId}).select({
        '_id': 0,
        'createdAt': 0,
        'updatedAt': 0
    });

    return {siguiendo, seguido};
}


module.exports = {
    seguidorYseguido,
}