const { response } = require("express");
const fs = require('fs-extra');

const { seguidorYseguido } = require("../helpers/follow");
const { uploadImage, deleteImage } = require("../helpers/cloudinary");

const Usuario = require("../models/Usuario");



const getUsuario = async (req, res = response) => {

    const { id } = req.params;
    const { id: miId } = req.usuario;

    try {
        const usuario = await Usuario.findById(id);
        
        if(!usuario){
            return res.status(400).json({
                ok: false,
                msg: 'No existe el usuario'
            });
        }
        
        const {siguiendo, seguido} = await seguidorYseguido(id, miId);
        res.status(200).json({
            ok:true,
            usuario,
            siguiendo,
            seguido
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error, hable con el administrador'
        });
    }
}    


const modificarUsuario = async (req, res = response) => {

    let usuario = req.usuario;
    const nuevosDatos = req.body;

    try {
        usuario = await Usuario.findByIdAndUpdate(usuario.id, nuevosDatos, {new: true});
        res.json({
            ok: true,
            msg: 'Perfil actualizado',
            usuario
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error  hable con el administrador',
        });
    }
}


const buscarUsuarios = async (req, res = response) => {

    const { termino } = req.params;
    let regex = new RegExp(termino, 'i');
    const { page, perPage } = req.query;
    
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(perPage, 10) || 10,
    };

    try {
        const usuarios = await Usuario.paginate({name: regex}, options);
        res.status(200).json({
            ok: true,
            usuarios
        });   
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'No se puede realizar la busqueda'
        });
    }

}


const subirAvatar = async (req, res = response) => {

    let usuario = req.usuario;
    const files = req.files;

    try {
        const {public_id, secure_url} = await uploadImage(files.image.tempFilePath, usuario.id)  

        if(usuario.avatar){
            await deleteImage(usuario.avatar.public_id)
        }
        
        usuario.avatar = { secure_url, public_id };
        await fs.unlink(files.image.tempFilePath)

        await usuario.save();
        res.status(200).json({
            ok: true,
            msg: 'Avatar guardado',
            usuario
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'No se pudo guardar la imagen'
        });
    }
}
    

const eliminarAvatar = async (req, res = response) => {

    const usuario = req.usuario;

    try {
        if(!usuario.avatar){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no tiene avatar',
            });
        }

        await deleteImage(usuario.avatar.public_id)
        usuario.avatar = null;
        await usuario.save();
        res.status(200).json({
            ok: true,
            msg: 'Avatar eliminado',
            usuario
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'No se pudo eliminar el avatar'
        });
    }
}


module.exports = {
    buscarUsuarios,
    getUsuario,
    modificarUsuario,
    subirAvatar,
    eliminarAvatar,
    // verAvatar
}

// const verAvatar = async (req, res = response) => {

//     const { id } = req.params;

//     try {
//         const usuario = await Usuario.findById(id);
//         if(!usuario){
//             return res.status(400).json({
//                 ok: false,
//                 msg: 'No existe el usuario'
//             });
//         }

//         res.sendFile(path.resolve(`uploads/${usuario.id}/${usuario.avatar}`));

//     } catch (error) {
//         res.status(500).json({
//             ok: false,
//             msg: 'No se pudo mostrar el avatar'
//         });
//     }
// } 
