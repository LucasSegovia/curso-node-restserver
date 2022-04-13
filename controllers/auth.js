const bcryptjs = require('bcryptjs');
const bcrypt = require('bcryptjs/dist/bcrypt');
const { response } = require('express');
const { generarJWT } = require('../helpers/generar-jwt');
const Usuario = require('../models/usuario');



const login = async(req, res = response) => {

    const {correo , password} = req.body;

    try {

        //VERIFICAR SI EL MAIL EXISTE
        const usuario = await Usuario.findOne({correo});
        if (!usuario) {
            return res.status(400).json({
                msg:'Usuario o Password incorrectos'
            });
        }//FIN VERIFICAR MAIL EXISTE

        //VERIFICAR SI EL USUARIO ESTA ACTIVO
        if (!usuario.estado) {
            return res.status(400).json({
                msg:'Usuario o Password incorrectos - estado: false'
            });
        }//FIN VERIFICAR ACTIVO USUARIO

        //VERIFICAR EL PASSWORD
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg:'Usuario o Password incorrectos - Password'
            });
        }//FIN VERIFICAR PASSWORD

        //GENERAR EL JSON WEB TOKEN

        const token = await generarJWT(usuario.id);



        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Hable con el ADMIN'
        })
    }

}//FIN LOGIN

module.exports = { login}