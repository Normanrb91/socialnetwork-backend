const { response } = require("express");
const fs = require('fs-extra');
const { uploadImage, deleteImage } = require("../helpers/cloudinary");
const Comentario = require("../models/Comentario");
const Like = require("../models/Like");

const Publicacion = require("../models/Publicacion");
const Seguimiento = require("../models/Seguimiento");


const nuevaPublicacion = async (req, res = response) => {

    const { id } = req.usuario;
    const files = req.files;

    try {
        let publicacion = new Publicacion({
            ...req.body,
            owner: id,
        });

        if(files?.image){
            if(files?.image.length > 1){
                for (let i = 0; i < files?.image.length; i++) {
                    let {public_id, secure_url} = await uploadImage(files?.image[i].tempFilePath, id) 
                    publicacion.images = publicacion.images.concat({ secure_url, public_id });
                    await fs.unlink(files.image[i].tempFilePath)
                }
            }else{
                const {public_id, secure_url} = await uploadImage(files?.image.tempFilePath, id)  
                publicacion.images = { secure_url, public_id };
                await fs.unlink(files.image.tempFilePath)
            } 
        }

        await publicacion.save();

        let publication = await Publicacion.findById(publicacion._id).populate('owner');
            
        const likes = (await Like.find({publication: publicacion._id})).length
        const coments = (await Comentario.find({publication: publicacion._id})).length
        const youLike = (await Like.find({publication: publicacion._id, id})).length

        publicacion = new Object();
        publicacion.id = publication._id;
        publicacion.text = publication.text;
        publicacion.owner = publication.owner;
        publicacion.images = publication.images;
        publicacion.timestamp = publication.timestamp;
        publicacion.likes = likes;
        publicacion.coments = coments;
        publicacion.youLike = youLike === 0 ? false : true

        res.status(201).json({
            ok: true,
            msg: 'Publicación realizada',
            publicacion
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error, hable con el administrador',
        });
    }
}


const eliminarPublicacion = async (req, res = response) => {

    const { id:owner } = req.usuario;
    const { id } = req.params

    try {

        let publicacion = await Publicacion.findById(id);

        if(!publicacion){
            return res.status(400).json({
                ok: false,
                msg: 'No existe la publicación'
            });
        }

        if(publicacion.owner.toString() !== owner){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privlegios para eliminar este comentario',
            });
        }

        publicacion = await Publicacion.findOneAndDelete({_id: id, owner});
        
        for (let i = 0; i < publicacion.images.length; i++) {
            await deleteImage(publicacion.images[i].public_id)
        }

        if(publicacion){
            return res.status(200).json({
                ok: true,
                msg: 'Publicación eliminada'
            });
        }

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error, hable con el administrador',
        });
    }
}


const getPublicacion = async (req, res = response) => {

    const { id } = req.params;
    const { id: user } = req.usuario;

    try {
        const publi = await Publicacion.findById(id).populate('owner', 'name avatar biography');
        if(!publi){
            return res.status(400).json({
                ok: false,
                msg: 'No existe la publicación'
            });
        }

        const likes = (await Like.find({publication: publi.id})).length
        const coments = (await Comentario.find({publication: publi.id})).length
        const youLike = (await Like.find({publication: publi.id, user})).length

        let publicacion = new Object();
        publicacion.id = publi.id;
        publicacion.text = publi.text;
        publicacion.owner = publi.owner;
        publicacion.images = publi.images;
        publicacion.timestamp = publi.timestamp;
        publicacion.likes = likes;
        publicacion.coments = coments;
        publicacion.youLike = youLike === 0 ? false : true
        
        res.status(201).json({
            ok: true,
            publicacion
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'No se pudo mostrar la publicación'
        });
    }
}


const getPublicacionesUser = async (req, res = response) => {

    const { id: user } = req.usuario;
    const { id: owner } = req.params;
    const { page, perPage } = req.query;
    
    const options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(perPage, 10) || 10,
        populate: { path: 'owner', select: 'name avatar biography' },
        sort: {'timestamp':-1}
    };

    try {
        const publicaciones  = await Publicacion.paginate({owner}, options);
        
        let docs = publicaciones.docs.map(async (publi) => {
            
            const likes = (await Like.find({publication: publi.id})).length
            const coments = (await Comentario.find({publication: publi.id})).length
            const youLike = (await Like.find({publication: publi.id, user})).length

            let publicacion = new Object();
            publicacion.id = publi.id;
            publicacion.text = publi.text;
            publicacion.owner = publi.owner;
            publicacion.images = publi.images;
            publicacion.timestamp = publi.timestamp;
            publicacion.likes = likes;
            publicacion.coments = coments;
            publicacion.youLike = youLike === 0 ? false : true

            return publicacion;
        });

        publicaciones.docs = await Promise.all(docs);

        res.status(201).json({
            ok: true,
            publicaciones
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'No se pudo mostrar las publicaciones'
        });
    }
}


const getPublicacionesSeguidos = async (req, res = response) => {

    const { id: user } = req.usuario;
    const { page, perPage } = req.query;
    
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(perPage, 10) || 10,
      populate: { path: 'owner', select: 'name avatar' },
      sort: {'timestamp':-1}
    };

    try {
        let siguiendo = await Seguimiento.find({user}).populate('followed');
        siguiendo = siguiendo.map(s => s.followed.id );
        siguiendo.push(user)

        let publicaciones = await Publicacion.paginate({owner: {'$in': siguiendo}}, options);

        let docs = publicaciones.docs.map(async (publi) => {
            
            const likes = (await Like.find({publication: publi.id})).length
            const coments = (await Comentario.find({publication: publi.id})).length
            const youLike = (await Like.find({publication: publi.id, user})).length

            let publicacion = new Object();
            publicacion.id = publi.id;
            publicacion.text = publi.text;
            publicacion.owner = publi.owner;
            publicacion.images = publi.images;
            publicacion.timestamp = publi.timestamp;
            publicacion.likes = likes;
            publicacion.coments = coments;
            publicacion.youLike = youLike === 0 ? false : true

            return publicacion;
        });

        publicaciones.docs = await Promise.all(docs);

        res.status(201).json({
            ok: true,
            publicaciones
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error, hable con el administrador'
        });
    }
}


module.exports = {
    nuevaPublicacion,
    eliminarPublicacion,
    //getImagePublicacion,
    getPublicacion,
    getPublicacionesUser,
    getPublicacionesSeguidos,
}


// const getImagePublicacion = async (req, res = response) => {

//     const { id } = req.params;

//     try {
//         const publicacion = await Publicacion.findById(id);
//         if(!publicacion){
//             return res.status(400).json({
//                 ok: false,
//                 msg: 'No existe la publicación'
//             });
//         }

//         if(!publicacion.image){
//             return res.status(200).json({
//                 ok: true,
//                 msg: 'Esta publicacion no tiene imagen'
//             });
//         }

//         res.sendFile(path.resolve(`uploads/${publicacion.owner}/${publicacion.image}`));

//     } catch (error) {
//         res.status(500).json({
//             ok: false,
//             msg: 'No se pudo mostrar el avatar'
//         });
//     }
// }
