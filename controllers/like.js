const { response } = require("express");
const { seguidorYseguido } = require("../helpers/follow");
const Like = require("../models/Like");


const darLike = async (req, res = response) => {

    const { id:user } = req.usuario;
    const { id:publication } = req.params;

    try {
        let like = await Like.findOne({user, publication});

        if(like){
            return res.status(400).json({
                ok: false,
                msg: 'Ya has dado like ha esta publicación'
            });
        }

        like = new Like({user, publication});
        await like.save();
        res.status(200).json({
            ok: true,
            msg: 'Has dado like',
            like
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido dar like',
        });
    }

}


const quitarLike = async (req, res = response) => {

    const { id:user } = req.usuario;
    const { id:publication } = req.params;

    try {
        let like = await Like.findOne({user, publication});

        if(!like){
            return res.status(400).json({
                ok: false,
                msg: 'No has dado like a la publicación'
            });
        }

        like = await Like.findOneAndDelete({user, publication});
        if(like){
            res.status(200).json({
                ok: true,
                msg: 'Has quitado el like de la publicación',
                unLike: like
            });
        }

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido quitar el like',
        });
    }

}


const getListadoUsuariosLike = async (req, res = response) => {

    const { id } = req.usuario;
    const { id:publication } = req.params;
    const { page, perPage } = req.query;
    
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(perPage, 10) || 10,
      populate: { path: 'user', select: 'name avatar biography' },
      sort: {'timestamp':-1}
    };

    try {
        let usuarios = await Like.paginate({publication}, options);

        let docs = usuarios.docs.map(async (user) => {
            let {siguiendo, seguido} = await seguidorYseguido(user.user.id, id);
            siguiendo ? siguiendo = true : siguiendo = false;
            seguido ? seguido = true: seguido = false;

            let usuario = new Object();
            usuario.id = user.user.id;
            usuario.name = user.user.name;
            usuario.avatar = user.user.avatar;
            usuario.biography = user.user.biography
            usuario.siguiendo = siguiendo;
            usuario.seguido = seguido;

            return usuario;
        });

        usuarios.docs = await Promise.all(docs);
    
        res.status(200).json({
            ok: true,
            publication,
            usuarios
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error, hable con el administrador'
        });
    }
}


module.exports = {
    darLike,
    quitarLike,
    getListadoUsuariosLike
}