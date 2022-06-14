const {Router} = require('express');
const { crearComentario, borrarComentario, getComentariosPublicacion } = require('../controllers/comment');
const { validarjwt } = require('../middlewares/validar-jwt');

const router = Router();

//Rutas de Comment - host + api/comment

router.post('/new/:id', validarjwt, crearComentario);

router.delete('/delete/:id', validarjwt, borrarComentario);

router.get('/:id', validarjwt, getComentariosPublicacion);

module.exports = router;