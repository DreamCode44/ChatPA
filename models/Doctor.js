const { DataTypes } = require('sequelize');
const { sequelize } = require("../database")

const Doctor = sequelize.define('Doctor', {
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
}, {
    tableName: 'doctor',
    timestamps: false
});

Doctor.removeAttribute('id');

module.exports = Doctor
