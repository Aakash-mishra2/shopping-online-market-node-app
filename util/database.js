const Sequelize = require('sequelize');
//database-name, user-name, password, 
const sequelize = new Sequelize('node-complete', 'root', 'shadow234', {
    dialect: 'mysql', 
    host: 'localhost'
});

module.exports = sequelize;