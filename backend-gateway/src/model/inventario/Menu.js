import { DataTypes } from 'sequelize';

const Menu = (sequelize) => {
    const Menu = sequelize.define('Menu', {
        menu_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        start_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        end_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'user',
                key: 'user_id'
            }
        },
        last_modified: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'menu',
        timestamps: false,
        indexes: [
            {
                fields: ['user_id']
            },
            {
                fields: ['active']
            },
            {
                fields: ['start_date', 'end_date']
            }
        ]
    });

    Menu.associate = function(models) {
        // Un menú pertenece a un usuario (creador/modificador)
        Menu.belongsTo(models.Usuario, {
            foreignKey: 'user_id',
            targetKey: 'user_id',
            as: 'creator'
        });

        // Un menú puede tener muchos items en el catálogo
        Menu.hasMany(models.Catalogo, {
            foreignKey: 'menu_id',
            sourceKey: 'menu_id',
            as: 'catalog_items'
        });
    };

    // Metodo para activar un menú
    Menu.prototype.activate = function() {
        return this.update({ active: true });
    };

    // Metodo para desactivar un menú
    Menu.prototype.deactivate = function() {
        return this.update({ active: false });
    };

    // Metodo para verificar si un menú está activo actualmente
    Menu.prototype.isCurrentlyActive = function() {
        const now = new Date();
        return this.active &&
            (!this.start_date || this.start_date <= now) &&
            (!this.end_date || this.end_date >= now);
    };

    // Metodo para encontrar menús activos
    Menu.findActiveMenus = function() {
        return this.findAll({
            where: { active: true },
            include: [{ all: true }],
            order: [['last_modified', 'DESC']]
        });
    };

    // Metodo para encontrar menús por usuario
    Menu.findByUserId = function(userId) {
        return this.findAll({
            where: { user_id: userId },
            include: [{ all: true }],
            order: [['last_modified', 'DESC']]
        });
    };

    // Metodo para actualizar las fechas del menú
    Menu.prototype.updateDates = function(startDate, endDate) {
        return this.update({
            start_date: startDate,
            end_date: endDate,
            last_modified: new Date()
        });
    };

    return Menu;
};

export default Menu;