
const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const usuario = require('../models/usuario');

const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next  ) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        });
    }

    try {
        
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        //leer el usuario que corresponde al uid 
        const usuario = await Usuario.findById(uid);

        //PREGUNTO SI EL USUARIO EXISTE
        if(!usuario){
            return res.status(401).json({
                msg:'Token NO valido - usuario NO existe en DB'
            })
        }


        //PREGUNTA SI EL USUARIO HA SIDO BORRADO

        if(!usuario.estado){
            return res.status(401).json({
                msg:'Token NO valido - usuario dado de baja'
            })
        }


        req.usuario=usuario;


        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg:' Token NO valido'
        });
    }//FIN CATCH

}

module.exports = {
    validarJWT
}