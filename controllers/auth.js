const bcryptjs = require('bcryptjs');
const bcrypt = require('bcryptjs/dist/bcrypt');
const { response } = require('express');
const { json } = require('express/lib/response');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');
const usuario = require('../models/usuario');
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

const googleSignIn = async(req, res = response) =>{

    const { id_token } = req.body;

    try {

        const { correo, nombre, img } = await googleVerify( id_token );

        let usuario = await Usuario.findOne( { correo } );

        if( !usuario ){
            //CREA USUARIO
            const data = { 
                nombre,
                correo,
                password:':P',
                img,
                google:true
            };//FIN CONTENIDO USUARIO

            usuario = new Usuario (data);
            await usuario.save();
        }//FIN IF USUARIO

        if (!usuario.estado){
            return res.status(401).json({
                msg:'Hable con el admin, usuario BLOQUEADO'
            });
        }

        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        });

    } catch (error) {
        res.status(400).json({
            ok:false,
            msg:'El token NO se pudo verificar'
        });
    }


}//FIN GOOGLE SIGN IN

module.exports = { 
    login,
    googleSignIn
}
