const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('PA', 'root', 'n0m3l0', {
    host: 'localhost',
    port: '3306',
    dialect: 'mysql'
});

module.exports = { sequelize }