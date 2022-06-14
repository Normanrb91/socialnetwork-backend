const {response} = require('express');
const { getCredencials } = require('../helpers/generar-jwt');
const Usuario = require('../models/Usuario');


const validarjwt = async(req, res = response, next) => {

    const token = req.header('Authorization').split(' ')[1];
    
    if(!token){
        res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    try {
        const {uid} = await getCredencials(token);
        const usuario = await Usuario.findOne({ _id: uid, 'tokens.token': token })

        if(!usuario){
            return res.status(401).json({
                ok: false,
                msg: 'Token no valido'
            });
        }

        req.usuario = usuario,
        req.token = token
        
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        });
    }

    next();
}

module.exports = {
    validarjwt
}
