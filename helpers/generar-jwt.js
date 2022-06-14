const jwt = require('jsonwebtoken');

const generarJWT = (uid, email) =>{

    return new Promise((resolve, reject) =>{

        const paylod = {uid, email}

        jwt.sign(paylod, process.env.SECRET_JWT, 
            (err, token)=>{

            if(err) reject('No se pudo generar el token');
        
            resolve(token);
        });
    });
}


const getCredencials = (token) => {
    return new Promise((resolve, reject) =>{

        jwt.verify(token, process.env.SECRET_JWT, 
            (err, data)=>{

            if(err) reject('token no valido');
        
            resolve(data);
        });
    });
}

module.exports = {
    generarJWT,
    getCredencials
}