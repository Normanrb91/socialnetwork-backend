const {Router} = require('express');

const { validarjwt } = require('../middlewares/validar-jwt');
const { darLike, quitarLike, getListadoUsuariosLike } = require('../controllers/like');

const router = Router();

//Rutas de Likea - host + api/like


router.post('/:id', validarjwt, darLike);

router.delete('/:id', validarjwt, quitarLike);

router.get('/listaLike/:id', validarjwt, getListadoUsuariosLike);


module.exports = router;