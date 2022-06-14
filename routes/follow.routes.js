const {Router} = require('express');

const { validarjwt } = require('../middlewares/validar-jwt');
const { follow, unFollow, followers, followings } = require('../controllers/follow');


const router = Router();

//Rutas de Follow - host + api/follow

router.get('/:id', validarjwt, follow);

router.delete('/:id', validarjwt, unFollow);

router.get('/followers/:id', validarjwt, followers);

router.get('/followings/:id', validarjwt, followings);


module.exports = router;