const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    //this anonymous is just registered as middleware for incoming requests 
    // so this code will only run for incoming requests which on the other can only reach this if 
    // we start our server successfully with app listen 
    // and that is only true if we are done with initialization code of sequelize so its guaranteed that we will find a user here
    User.findByPk(1).then(user => {
        // this user is not js object but a sequelize object with all values stored in database and all the utility methods that sequelize added like destroy. we are storing this sequelize object in this request which is a extended object and not just a js object with just field values in it.
        // and therefore whenever we call request user in our app we can execute methods like destroy
        req.user = user;
        next();
    }).catch(err => console.log(err));
});
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE'
});
User.hasMany(Product);

sequelize
    // .sync({force: true})
    .sync()
    .then(result => {
        //console.log(result);
        User.findByPk(1);
    })
    .then(user => {
        if (!user) {
            //return User.create({ name: 'SKY', email: 'aakashmishra.gmail.com' });
        }
        //same as resolving a promise to user i.e. return Promise.resolve(user);
        return user;
    })
    .then(user => {
        console.log(user); app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });

