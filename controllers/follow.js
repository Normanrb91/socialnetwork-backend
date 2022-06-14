const { response } = require('express');
const { seguidorYseguido } = require('../helpers/follow');
const  Seguimiento = require('../models/Seguimiento');


const follow = async (req, res = response) => {

    const { id: user} = req.usuario;
    const { id: followed } = req.params;

    try {
        let seguimiento = await Seguimiento.findOne({user, followed});

        if(seguimiento){
            return res.status(400).json({
                ok: false,
                msg: 'Ya sigues a este usuario'
            });
        }

        seguimiento = new Seguimiento({user, followed});
        await seguimiento.save();
        res.status(200).json({
            ok: true,
            msg: 'Seguido con exito',
            seguimiento
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido seguir',
        });
    }
}


const unFollow = async (req, res = response) => {

    const { id: user } = req.usuario;
    const { id: followed } = req.params;

    try {
        let seguimiento = await Seguimiento.findOne({user, followed});

        if(!seguimiento){
            return res.status(400).json({
                ok: false,
                msg: 'No sigues a este usuario'
            });
        }

        seguimiento = await Seguimiento.findOneAndDelete({user, followed});
        if(seguimiento){
            res.status(200).json({
                ok: true,
                msg: 'Usuario dejado de seguir'
            });
        }

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido dejar seguir',
        });
    }

}


const followers = async (req, res = response) => {

    const { id } = req.usuario;
    const { id:followed } = req.params;
    const { page, perPage } = req.query;
    
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(perPage, 10) || 20,
      populate: { path: 'user', select: 'name avatar biography' },
      sort: {'timestamp':-1}
    };

    try {
        let seguidores = await Seguimiento.paginate({followed}, options);

        let docs = seguidores.docs.map(async (user) => {
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

        seguidores.docs = await Promise.all(docs);

        res.status(200).json({
            ok: true,
            seguidores
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido mostrar seguidos',
        });
    }
}


const followings = async (req, res = response) => {
    
    const { id } = req.usuario;
    const { id:user } = req.params;
    const { page, perPage } = req.query;
    
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(perPage, 10) || 20,
      populate: { path: 'followed', select: 'name avatar biography' },
      sort: {'timestamp':-1}
    };

    try {
        let siguiendo = await Seguimiento.paginate({user}, options);

        let docs = siguiendo.docs.map(async (user) => {
            let {siguiendo, seguido} = await seguidorYseguido(user.followed.id, id);
            siguiendo ? siguiendo = true : siguiendo = false;
            seguido ? seguido = true: seguido = false;

            let usuario = new Object();
            usuario.id = user.followed.id;
            usuario.name = user.followed.name;
            usuario.avatar = user.followed.avatar;
            usuario.biography = user.followed.biography
            usuario.siguiendo = siguiendo;
            usuario.seguido = seguido;

            return usuario;
        });

        siguiendo.docs = await Promise.all(docs);
    
        res.status(200).json({
            ok: true,
            siguiendo
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido mostrar seguidos',
        });
    }

}

module.exports = {
    follow,
    unFollow,
    followers,
    followings,
}
