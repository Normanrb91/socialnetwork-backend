const { response } = require("express");
const Comentario = require('../models/Comentario');
const Publicacion = require("../models/Publicacion");
const Usuario = require("../models/Usuario");


const crearComentario = async (req, res = response) => {

    const { id } = req.usuario;
    const { id:publi } = req.params;

    try {

        let publiacion = await Publicacion.findById(publi);
        let owner = await Usuario.findById(id);

        if(!publiacion){
            return res.status(400).json({
                ok: false,
                msg: 'No existe la publicación'
            });
        }

        let comentario = new Comentario({
            ...req.body,
            owner,
            publication: publi
        });

        await comentario.save();
        res.status(201).json({
            ok: true,
            comentario
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error, hable con el administrador',
        });
    }

}


const borrarComentario = async (req, res = response) => {

    const { id } = req.usuario;
    const idComment = req.params.id;

    try {
        const comentario = await Comentario.findById(idComment);
        if(!comentario){
            return res.status(404).json({
                ok: false,
                msg: 'No existe el comentario',
            });
        }

        if(comentario.owner.toString() !== id){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privlegios para eliminar este comentario',
            });
        }

        await Comentario.findByIdAndRemove(idComment)
        res.json({ok: true, msg: 'Comentario eliminado', id: idComment });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error, hable con el administrador',
        });
    }
}


const getComentariosPublicacion = async (req, res = response) => {

    const { id } = req.params;
    const { page, perPage } = req.query;
    
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(perPage, 10) || 10,
      populate: { path: 'owner', select: 'name avatar' },
      sort: {'timestamp':-1}
    };

    try {
        const comentarios = await Comentario.paginate({publication : id}, options);
        res.status(201).json({
            ok: true,
            publication: id,
            comentarios
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error, hable con el administrador',
        });
    }

}


module.exports = {
    crearComentario,
    borrarComentario,
    getComentariosPublicacion
}