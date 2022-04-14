const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = ( files, extensionesValidas = ['png','jpg','jpeg','gif',], carpeta ='' ) => {

    return new Promise ((resolve, reject) => {

        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length-1];
    
        //VALIDAR LA EXTENSION
        if(!extensionesValidas.includes(extension)){
            return reject(`La extension ${ extension } no es permitida, extensiones validas ==> ${extensionesValidas}`);
        }//FIN IF
    
        const nombreTemporal = uuidv4() + '.' + extension;
        const uploadPath = path.join( __dirname, '../uploads/', carpeta, nombreTemporal);
      
        archivo.mv(uploadPath, (err) => {
          if (err) {
              reject(err);
          }
          resolve(nombreTemporal);
        });
    });

}//FIN SUBIR ARCHIVO

module.exports = {
    subirArchivo
}