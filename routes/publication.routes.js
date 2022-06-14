const {Router} = require('express');

const uploadImage = require('../middlewares/validar-imagen');
const { validarjwt } = require('../middlewares/validar-jwt');
const { 
    nuevaPublicacion, 
    eliminarPublicacion, 
    // getImagePublicacion, 
    getPublicacion, 
    getPublicacionesUser, 
    getPublicacionesSeguidos} = require('../controllers/publication');

const router = Router();

//Rutas de Publicaciones- host + api/publication

router.post('/new', validarjwt, uploadImage, nuevaPublicacion);

router.delete('/delete/:id', validarjwt, eliminarPublicacion);

router.get('/:id', validarjwt, getPublicacion);

router.get('/all/:id', validarjwt, getPublicacionesUser);

router.get('/', validarjwt, getPublicacionesSeguidos);


module.exports = router;


// router.get('/image/:id', validarjwt, getImagePublicacion);