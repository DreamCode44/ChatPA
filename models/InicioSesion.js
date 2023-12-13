const { DataTypes } = require('sequelize');
const { sequelize } = require("../database")

const InicioSesion = sequelize.define('InicioSesion', {
    usuario: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    correo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    contra: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    clave_maestra: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'inicio_sesion',
    timestamps: false
});

InicioSesion.removeAttribute('id');

module.exports = InicioSesion
