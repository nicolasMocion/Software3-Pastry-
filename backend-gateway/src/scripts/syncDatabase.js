import { fileURLToPath } from 'url';
import { dirname } from 'path';
import sequelize from '../config/db.js';
import {Usuario} from '../model/autenticacion/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function syncDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');

        // Sincronizar modelos
        await Usuario.sync({ alter: false }); // Usar { force: true } solo en desarrollo para resetear tablas

        console.log('Modelos sincronizados con la base de datos.');
    } catch (error) {
        console.error('Error al sincronizar la base de datos:', error);
    }
}

// Verificar si es el módulo principal
const isMainModule = process.argv[1] === __filename;

// Ejecutar si se llama directamente
if (isMainModule) {
    syncDatabase();
}

export default syncDatabase;