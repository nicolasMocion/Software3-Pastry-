import { DataTypes } from 'sequelize';

const AccionUsuario = (sequelize) => {
    const UserAction = sequelize.define('UserAction', {
        user_action_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'user',
                key: 'user_id'
            }
        },
        action_type: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 100]
            }
        },
        action_description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        entity_type: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        entity_id: {
            type: DataTypes.UUID,
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'user_action',
        timestamps: false,
        indexes: [
            {
                fields: ['user_id']
            },
            {
                fields: ['entity_type', 'entity_id']
            },
            {
                fields: ['created_at']
            }
        ]
    });

    UserAction.associate = function(models) {
        // Una acción pertenece a un usuario
        UserAction.belongsTo(models.User, {
            foreignKey: 'user_id',
            targetKey: 'user_id',
            as: 'user'
        });
    };

    // Metodo para encontrar acciones por usuario
    UserAction.findByUserId = function(userId) {
        return this.findAll({
            where: { user_id: userId },
            order: [['created_at', 'DESC']]
        });
    };

    // Metodo para encontrar acciones por entidad
    UserAction.findByEntity = function(entityType, entityId) {
        return this.findAll({
            where: {
                entity_type: entityType,
                entity_id: entityId
            },
            order: [['created_at', 'DESC']]
        });
    };

    return UserAction;
};

export default AccionUsuario;