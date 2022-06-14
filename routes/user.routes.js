const {Router} = require('express');

const { validarjwt } = require('../middlewares/validar-jwt');
const uploadImage = require('../middlewares/validar-imagen');
const { 
    buscarUsuarios, 
    getUsuario, 
    modificarUsuario, 
    eliminarAvatar, 
    // verAvatar, 
    subirAvatar } = require('../controllers/user');

const router = Router();

//Rutas de usuario - host + api/user

router.get('/:id', validarjwt, getUsuario);

router.get('/search/:termino', validarjwt, buscarUsuarios);

router.post('/update', validarjwt, modificarUsuario);

router.post('/avatar', validarjwt, uploadImage, subirAvatar);

router.delete('/avatar', validarjwt, eliminarAvatar);


module.exports = router;

// router.get('/:id/avatar', validarjwt, verAvatar);