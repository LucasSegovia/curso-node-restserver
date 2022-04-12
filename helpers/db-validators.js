const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRolValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
      throw new Error(`El rol ${rol} no esta registrado en la BD`);
    }//FIN IF
}

const emailExiste = async (correo = '') => {
    const existeEmail = await Usuario.findOne({correo});
            if (existeEmail) {
                throw new Error(`Este correo: ${correo} ya esta registrado en la BD`);
                }//FIN IF
}//FIN EMAIL EXISTE

const existeUsuarioPorId= async ( id ) => {
    const existeUsuario = await Usuario.findById(id);
            if (!existeUsuario) {
                throw new Error(`El ID ${id} NO existe`);
                }//FIN IF
}//FIN EMAIL EXISTE




module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId
}