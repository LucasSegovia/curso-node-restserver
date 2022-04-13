const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../database/config');


class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        this.authPath = '/api/auth';
        
        //CONECTAR A BASE DE DATOS
        this.conectarDB(); 
        //MIDDLEWARES
        this.middlewares();

        //RUTAS DE MI APP
        this.routes();

    }//FIN CONSTRUCTOR
    
    
    async conectarDB(){
        await dbConnection();
    }

    middlewares(){

        //CORS
        this.app.use( cors() );

        //LECTURA Y PARSEO DEL BODY
        this.app.use( express.json() );

        //DIRECTORIO PUBLICO
        this.app.use( express.static('public') );

    }//FIN MIDD

    routes(){

        this.app.use(this.authPath,require('../routes/auth'));

        this.app.use(this.usuariosPath,require('../routes/usuarios'));
        


    }//FIN ROUTES

    listen(){
        this.app.listen(this.port,()=>{
        console.log('Servidor corriendo en puerto',this.port);
        });
    }

}//FIN SERVER

module.exports = Server;