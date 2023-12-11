const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

//whenever I start my application all my models auto get converted to tables whenever we start our application.
//to sync all your models you defined using define method to the database by creating appropriate tables for them. 
sequelize.sync().then(result => {
    //console.log(result);
})
.catch(err => { console.log(err); });

app.listen(3000);
