import  { DataTypes } from 'sequelize';

const RolUsuario = (sequelize) => {
    const user_role = sequelize.define('user_role', {
        user_role_id: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false
        },
        role_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        description: {
            type: DataTypes.TEXT
        }
    }, {
        tableName: 'user_role',
        timestamps: false
    });

    // Metodo para configurar asociaciones
    user_role.associate = function(models) {
        // Un rol puede tener muchos usuarios
        user_role.hasMany(models.Usuario, {
            foreignKey: 'user_role_id',
            sourceKey: 'user_role_id',
            as: 'usuarios'
        });
    };

    // Metodo de clase para obtener roles activos
    user_role.getRolesActivos = function() {
        return this.findAll();
    };

    //Metodo para obtener el id de un rol de usuario segun el nombre
    user_role.getRolIdByName= async function (name){
        const rol_usuario = await this.findOne({
            where:{role_name : name},
            raw : true});
        return rol_usuario.user_role_id;
    };

    return user_role;
};

export default RolUsuario;