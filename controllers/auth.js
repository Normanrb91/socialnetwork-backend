const {response} = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const {generarJWT, getCredencials} = require('../helpers/generar-jwt');
const { confirmTemplate, enviarEmail, deleteTemplate } = require('../helpers/email');


const crearUsuario = async(req, res = response)=>{

    const { email, password} = req.body;

    try {
        let usuario = await Usuario.findOne({email});
        if(usuario){
            return res.status(400).json({
                ok: false,
                msg: 'El email ya existe',
            });
        }

        usuario = new Usuario(req.body);
        const salt = bcrypt.genSaltSync(10);
        usuario.password = bcrypt.hashSync(password, salt);
       

        const token = await generarJWT(usuario.id, usuario.email);
        usuario.tokens = usuario.tokens.concat({ token });
        // const template = confirmTemplate(usuario.name, token);
        // enviarEmail(usuario.email, 'Verificar Cuenta', template);
        await usuario.save();
        
        res.status(201).json({
            ok: true,
            token,
            usuario
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error, hable con el administrador',
        });
    }
}


const verificarUsuario = async (req, res = response) => {

    const { token } = req.params;

    try {
        const { uid, email } = await getCredencials(token);

        let usuario = await Usuario.findOne({id: uid, email});

        if(!usuario){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe',
            });
        }

        usuario.status = 'VERIFIED';
        usuario.tokens = usuario.tokens.concat({ token });
        await usuario.save();
        res.status(201).json({
            ok: true,
            token,
            usuario
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error, hable con el administrador',
        });
    }
}


const loginUsuario = async (req, res = response )=>{

    const {email, password} = req.body;

    try {
        const usuario = await Usuario.findOne({email});
        if(!usuario){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario o la contraseña no son correctos!',
            });
        }
       
        const validPassword = bcrypt.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                    ok: false,
                    msg: 'El usuario o la contraseña no son correctos!',
            });
        }

        if(usuario.status !== 'VERIFIED'){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no está verificado',
            });
        }

        const token = await generarJWT(usuario.id, usuario.email);
        usuario.tokens = usuario.tokens.concat({ token });
        await usuario.save();
        res.status(200).json({
            ok: true,
            token,
            usuario
        });
            
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error, hable con el administrador',
        });
    }
}


const logoutUsuario = async (req, res = response) => {

    const {token:mitoken, usuario} = req;
    
    try {
        usuario.tokens = usuario.tokens.filter( t => t.token !== mitoken);

        await usuario.save();
        res.status(200).json({
            ok: true,
            msg: 'Sesión cerrada'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error, hable con el administrador',
        });
    }
}


const logoutAllUsuarios = async (req, res = response) => {

    const { usuario } = req;
    
    try {
        usuario.tokens = [];
        await usuario.save();
        res.status(200).json({
            ok: true,
            msg: 'Todas las Sesiones cerrada'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error, hable con el administrador',
        });
    }


}


const eliminarUsuario = async (req, res = response) => {

    let usuario = req.usuario;

    try {
        // await Seguimiento.deleteMany({'user': usuario.id});
        // await Seguimiento.deleteMany({'followed': usuario.id});
        // await usuario.remove();

        usuario.status = 'INACTIVE';
        await usuario.save();
        const template = deleteTemplate(usuario.name);
        enviarEmail(usuario.email, 'Cuenta Desactivada', template);

        res.status(201).json({
            ok: true,
            msg: 'Cuenta desactivada'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error, hable con el administrador',
        });
    }
}


const validarTokenUsuario = async (req, res = response ) => {

    res.status(201).json({
        ok: true,
        token: req.token,
        usuario: req.usuario
    });

}


module.exports = {
    crearUsuario,
    verificarUsuario,
    loginUsuario,
    logoutUsuario,
    logoutAllUsuarios,
    eliminarUsuario,
    validarTokenUsuario
    
}