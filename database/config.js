const mongoose = require('mongoose');
require('colors');


const dbConnection = async() => {


    try {
        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Base de datos ONLINE'.green);

    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la DB');
    }

}//FIN DBCONECTION

module.exports = {
    dbConnection

}