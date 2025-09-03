import { Sequelize } from 'sequelize';
import fs from 'fs';
import dotenv from 'dotenv';

//maricada que carga la variables de entorno
dotenv.config();

// Lee el certificado CA (ajusta la ruta según sea necesario)
const caCert = fs.readFileSync('./ca.pem').toString();

//creacion del sequelize
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        port: process.env.DB_PORT || 5432,
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        dialectOptions: {
            ssl: {
                rejectUnauthorized: true,
                ca: caCert
            }
        }
    }
);

// Verificar la conexión
sequelize.authenticate()
    .then(() => {
        console.log('Conexión a la base de datos establecida correctamente.');
    })
    .catch(err => {
        console.error('No se puede conectar a la base de datos:', err);
    });

export default sequelize;