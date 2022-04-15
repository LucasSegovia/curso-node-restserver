const Role = require('../models/role');
const { Usuario, Categoria,Producto } = require('../models');

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

const existeCategoriaPorId= async ( id ) => {
    const existeCategoria = await Categoria.findById(id);
            if (!existeCategoria) {
                throw new Error(`El ID ${id} NO existe para esa categoria`);
                }//FIN IF
}//FIN EMAIL EXISTE

const existeProductoPorId= async ( id ) => {
    const existeProducto = await Producto.findById(id);
            if (!existeProducto) {
                throw new Error(`El producto con este ID ${id} NO existe`);
                }//FIN IF
}//FIN EMAIL EXISTE


const coleccionesPermitidas = ( coleccion = '', colecciones = [] ) => {

    const incluida = colecciones.includes(coleccion);

    if(!incluida){
        throw new Error(`La coleccin ${coleccion} no es permitida, ==> permitidas ${colecciones}`);
    }

    return true;

}//FIN COLECCIONES PERMITIDAS



module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}